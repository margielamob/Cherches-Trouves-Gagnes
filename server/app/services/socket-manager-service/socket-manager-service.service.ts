/* eslint-disable max-lines */
import { PrivateGameInformation } from '@app/interface/game-info';
import { EventMessageService } from '@app/services//message-event-service/message-event.service';
import { CluesService } from '@app/services/clues-service/clues.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { LimitedTimeGame } from '@app/services/limited-time-game-service/limited-time-game.service';
import { MultiplayerGameManager } from '@app/services/multiplayer-game-manager/multiplayer-game-manager.service';
import { ScoresHandlerService } from '@app/services/scores-handler-service/scores-handler.service';
import { BASE_64_HEADER } from '@common/base64';
import { Coordinate } from '@common/coordinate';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';
import { Message } from '@common/prototype/message';
import { ScoreType } from '@common/score-type';
import { SocketEvent } from '@common/socket-event';
import * as http from 'http';
import * as LZString from 'lz-string';
import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';
import { UserManagerService } from '@app/services/prototype-services/user-manager-service.service';
import { LoggerService } from '@app/services/logger-service/logger.service';
import { User } from '@common/prototype/user';
@Service()
export class SocketManagerService {
    private sio: Server;
    private rooms: Map<string, User[]>;

    // eslint-disable-next-line max-params -- all services are needed
    constructor(
        private gameManager: GameManagerService,
        private readonly multiplayerGameManager: MultiplayerGameManager,
        private eventMessageService: EventMessageService,
        private readonly scoresHandlerService: ScoresHandlerService,
        private limitedTimeService: LimitedTimeGame,
        private cluesService: CluesService,
        private userManagerService: UserManagerService,
        private logger: LoggerService,
    ) {
        this.rooms = new Map<string, User[]>();
        this.rooms.set('allChatProto', []);
    }

    set server(server: http.Server) {
        this.sio = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        if (!this.sio) {
            throw new Error('Server instance not set');
        }
        this.sio.on(SocketEvent.Connection, (socket: Socket) => {
            this.logger.logInfo(`new user connected with : ${socket.id}`);

            socket.on(SocketEvent.Disconnect, () => {
                this.logger.logWarning(`user disconnected with id : ${socket.id}`);
                this.userManagerService.removeUser(socket.id);
            });

            socket.on(SocketEvent.DisconnectFromChat, () => {
                this.userManagerService.removeUser(socket.id);
            });

            socket.on(SocketEvent.Authenticate, (userName: string) => {
                try {
                    this.userManagerService.addUser(socket.id, userName);
                    socket.join('allChatProto');
                    this.rooms.get('allChatProto')?.push({ username: userName });
                    socket.emit(SocketEvent.UserAuthenticated);
                    this.logger.logInfo(`authenticate successful, ${userName}`);
                } catch (e) {
                    socket.emit(SocketEvent.UserExists);
                    this.logger.logError(e);
                }
            });
            socket.on(SocketEvent.PrototypeMessage, (message: Message) => {
                socket.emit('NewMessage', { ...message, date: this.getTime(), type: 'to' });
                this.logger.logWarning('sent', { ...message, date: this.getTime(), type: 'from' });
                socket.to('allChatProto').emit('NewMessage', { ...message, date: this.getTime(), type: 'from' });
            });

            socket.on(
                SocketEvent.CreateGame,
                async (player: string, mode: GameMode, game: { card: string; isMulti: boolean }) =>
                    await this.createGameSolo(player, mode, game, socket),
            );

            socket.on(
                SocketEvent.CreateGameMulti,
                async (player: string, mode: GameMode, game: { card: string; isMulti: boolean }) =>
                    await this.createGameMulti(player, mode, game, socket),
            );

            socket.on(SocketEvent.Message, (message: string, roomId: string) => {
                socket.broadcast.to(roomId).emit(SocketEvent.Message, message);
            });

            socket.on(SocketEvent.FetchDifferences, (gameId: string) => {
                socket.emit(SocketEvent.FetchDifferences, this.gameManager.getNbDifferenceNotFound(gameId));
            });

            socket.on(SocketEvent.Clue, (gameId: string) => {
                this.gameManager.increaseNbClueAsked(gameId);
                const pixelResult = this.cluesService.findRandomPixel(gameId);
                switch (this.gameManager.getNbClues(gameId)) {
                    case 1:
                        this.sio.to(gameId).emit(SocketEvent.Clue, { clue: this.cluesService.firstCluePosition(pixelResult), nbClues: 1 });
                        break;
                    case 2:
                        this.sio.to(gameId).emit(SocketEvent.Clue, { clue: this.cluesService.secondCluePosition(pixelResult), nbClues: 2 });
                        break;
                    case 3:
                        this.sio.to(gameId).emit(SocketEvent.Clue, { clue: this.cluesService.thirdCluePosition(pixelResult), nbClues: 3 });
                }
                this.sio.to(gameId).emit(SocketEvent.EventMessage, this.eventMessageService.usingClueMessage());
            });

            socket.on(SocketEvent.AcceptPlayer, (roomId: string, opponentsRoomId: string, playerName: string) => {
                const request = this.multiplayerGameManager.getRequest(roomId);
                if (!this.multiplayerGameManager.playersRequestExists(roomId, opponentsRoomId) || !request) {
                    socket.emit(SocketEvent.PlayerLeft);
                    return;
                }

                this.multiplayerGameManager.removeGameWaiting(roomId);
                this.sio.sockets.emit(SocketEvent.GetGamesWaiting, {
                    mode: GameMode.Classic,
                    gamesWaiting: this.multiplayerGameManager.getGamesWaiting(GameMode.Classic),
                });

                this.sio.to(opponentsRoomId).emit(SocketEvent.JoinGame, { roomId, playerName });
                socket.join(roomId);
                for (const player of request) {
                    if (this.multiplayerGameManager.isNotAPlayersRequest(player.id, opponentsRoomId)) {
                        this.sio.to(player.id).emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.gameStarted);
                    }
                }
                this.multiplayerGameManager.deleteAllRequests(roomId);
                this.gameManager.setTimer(roomId);
                this.gameManager.sendTimer(this.sio, roomId, roomId);
            });

            socket.on(SocketEvent.RejectPlayer, (roomId: string, opponentsRoomId: string) => {
                this.multiplayerGameManager.deleteFirstRequest(roomId);
                if (this.multiplayerGameManager.theresARequest(roomId)) {
                    const newPlayerRequest = this.multiplayerGameManager.getNewRequest(roomId);
                    this.sio.to(roomId).emit(SocketEvent.RequestToJoin, newPlayerRequest);
                }

                this.sio.to(opponentsRoomId).emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.rejected);
            });

            socket.on(SocketEvent.JoinGame, (player: string, gameId: string) => {
                this.gameManager.addPlayer({ name: player, id: socket.id }, gameId);
                socket.join(gameId);
                socket.broadcast.to(gameId).emit(SocketEvent.JoinGame, { roomId: gameId, playerName: player });
                if (this.gameManager.isClassic(gameId)) {
                    this.sio.to(gameId).emit(SocketEvent.Play, gameId);
                } else {
                    const gameCard = this.gameManager.getGameInfo(gameId);
                    let gameCardInfo: PublicGameInformation;
                    if (gameCard) {
                        gameCardInfo = {
                            id: gameCard.id,
                            name: gameCard.name,
                            thumbnail: BASE_64_HEADER + LZString.decompressFromUTF16(gameCard.thumbnail),
                            nbDifferences: gameCard.differences.length,
                            idEditedBmp: gameCard.idEditedBmp,
                            idOriginalBmp: gameCard.idOriginalBmp,
                            multiplayerScore: gameCard.multiplayerScore,
                            soloScore: gameCard.soloScore,
                            isMulti: false,
                        };
                        socket.emit(SocketEvent.Play, { gameId, gameCard: gameCardInfo });
                    }
                }
            });

            socket.on(SocketEvent.LeaveGame, (gameId: string) => {
                if (!this.gameManager.isGameFound(gameId)) {
                    socket.emit(SocketEvent.Error);
                    return;
                }
                if (this.gameManager.isGameMultiplayer(gameId) && !this.gameManager.isGameOver(gameId)) {
                    socket.leave(gameId);
                    socket.broadcast
                        .to(gameId)
                        .emit(
                            SocketEvent.EventMessage,
                            this.eventMessageService.leavingGameMessage(this.gameManager.findPlayer(gameId, socket.id) as string),
                        );
                    if (this.gameManager.isClassic(gameId)) {
                        socket.leave(gameId);
                        this.gameManager.leaveGame(socket.id, gameId);
                    }
                    socket.broadcast.to(gameId).emit(this.gameManager.isClassic(gameId) ? SocketEvent.Win : SocketEvent.PlayerLeft);
                } else if (!this.gameManager.isGameMultiplayer(gameId)) {
                    socket.leave(gameId);
                    this.gameManager.leaveGame(socket.id, gameId);
                }
            });

            socket.on(SocketEvent.LeaveWaiting, (roomId: string, gameCard: string) => {
                if (roomId) {
                    const request = this.multiplayerGameManager.getRequest(roomId);
                    if (request) {
                        for (const player of request) {
                            this.sio.to(player.id).emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.playerQuit);
                        }
                    }
                    this.multiplayerGameManager.removeGameWaiting(roomId);
                    return;
                }

                this.multiplayerGameManager.deleteRequest(this.multiplayerGameManager.getRoomIdWaiting(gameCard), socket.id);
            });

            socket.on(SocketEvent.GetGamesWaiting, (mode: GameMode) => {
                socket.emit(SocketEvent.GetGamesWaiting, { mode, gamesWaiting: this.multiplayerGameManager.getGamesWaiting(mode) });
            });

            socket.on(SocketEvent.GameDeleted, (gameId: string) => {
                this.limitedTimeService.deleteGame(gameId);
                this.gameManager.gameCardDeletedHandle(gameId);
                if (this.multiplayerGameManager.isGameWaiting(gameId, undefined)) {
                    const roomId = this.multiplayerGameManager.getRoomIdWaiting(gameId);
                    this.sio.to(roomId).emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.deletedGame);
                    const request = this.multiplayerGameManager.getRequest(roomId);
                    if (request) {
                        for (const player of request) {
                            this.sio.to(player.id).emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.deletedGame);
                        }
                    }
                }
            });

            socket.on(SocketEvent.GamesDeleted, () => {
                this.limitedTimeService.deleteAllGames();
                this.gameManager.allGameCardsDeleted();
                this.sio.emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.allGamesDeleted);
                for (const gameId of this.multiplayerGameManager.getGamesWaiting(GameMode.Classic)) {
                    const roomId = this.multiplayerGameManager.getRoomIdWaiting(gameId);
                    this.multiplayerGameManager.deleteAllRequests(roomId);
                }
            });

            socket.on(SocketEvent.Difference, (differenceCoord: Coordinate, gameId: string) => {
                if (!this.gameManager.isGameFound(gameId)) {
                    socket.emit(SocketEvent.Error);
                    return;
                }
                const differences = this.gameManager.isDifference(gameId, socket.id, differenceCoord);
                if (!differences) {
                    socket.emit(SocketEvent.DifferenceNotFound);
                    this.sio
                        .to(gameId)
                        .emit(
                            SocketEvent.EventMessage,
                            this.eventMessageService.differenceNotFoundMessage(
                                this.gameManager.findPlayer(gameId, socket.id) as string,
                                this.gameManager.isGameMultiplayer(gameId),
                            ),
                        );
                    return;
                }
                this.sio
                    .to(gameId)
                    .emit(
                        SocketEvent.EventMessage,
                        this.eventMessageService.differenceFoundMessage(
                            this.gameManager.findPlayer(gameId, socket.id) as string,
                            this.gameManager.isGameMultiplayer(gameId),
                        ),
                    );
                socket.broadcast.to(gameId).emit(SocketEvent.DifferenceFound, this.gameManager.getNbDifferencesFound(differences, gameId, true));
                socket.emit(SocketEvent.DifferenceFound, this.gameManager.getNbDifferencesFound(differences, gameId));

                if (this.gameManager.isGameOver(gameId)) {
                    this.handleEndGame(gameId, socket);
                }

                if (this.gameManager.isLimitedTime(gameId)) {
                    this.gameManager.setNextGame(gameId);
                    const nextGameCard = this.gameManager.getGameInfo(gameId);
                    let gameCardInfo: PublicGameInformation;
                    if (nextGameCard) {
                        gameCardInfo = {
                            id: nextGameCard.id,
                            name: nextGameCard.name,
                            thumbnail: BASE_64_HEADER + LZString.decompressFromUTF16(nextGameCard.thumbnail),
                            nbDifferences: nextGameCard.differences.length,
                            idEditedBmp: nextGameCard.idEditedBmp,
                            idOriginalBmp: nextGameCard.idOriginalBmp,
                            multiplayerScore: nextGameCard.multiplayerScore,
                            soloScore: nextGameCard.soloScore,
                            isMulti: false,
                        };
                        this.sio.to(gameId).emit(SocketEvent.NewGameBoard, gameCardInfo);
                    }
                }
            });
        });
    }

    // eslint-disable-next-line max-params -- absolutely need all the params
    async createGameSolo(player: string, mode: GameMode, game: { card: string; isMulti: boolean }, socket: Socket) {
        const id = await this.gameManager.createGame({ player: { name: player, id: socket.id }, isMulti: game.isMulti }, mode, game.card);
        socket.join(id);
        this.gameManager.setTimer(id);
        this.gameManager.sendTimer(this.sio, id, socket.id);
        const gameCard = this.gameManager.getGameInfo(id);
        let gameCardInfo: PublicGameInformation;
        if (gameCard) {
            gameCardInfo = {
                id: gameCard.id,
                name: gameCard.name,
                thumbnail: BASE_64_HEADER + LZString.decompressFromUTF16(gameCard.thumbnail),
                nbDifferences: gameCard.differences.length,
                idEditedBmp: gameCard.idEditedBmp,
                idOriginalBmp: gameCard.idOriginalBmp,
                multiplayerScore: gameCard.multiplayerScore,
                soloScore: gameCard.soloScore,
                isMulti: false,
            };
            socket.emit(SocketEvent.Play, { gameId: id, gameCard: gameCardInfo });
            return;
        }
        socket.emit(SocketEvent.Play, { gameId: id });
    }

    // eslint-disable-next-line max-params -- absolutely need all the params
    async createGameMulti(player: string, mode: GameMode, game: { card: string; isMulti: boolean }, socket: Socket) {
        let roomId = this.multiplayerGameManager.getRoomIdWaiting(game.card);
        socket.emit(SocketEvent.WaitPlayer);
        if (this.multiplayerGameManager.isGameWaiting(game.card, mode)) {
            if (this.gameManager.hasSameName(roomId, player)) {
                socket.emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.wrongName);
                return;
            }

            if (mode === GameMode.Classic) {
                this.multiplayerGameManager.addNewRequest(roomId, { name: player, id: socket.id });

                if (this.multiplayerGameManager.theresOneRequest(roomId)) {
                    this.sio
                        .to(this.multiplayerGameManager.getRoomIdWaiting(game.card))
                        .emit(SocketEvent.RequestToJoin, { name: player, id: socket.id });
                }
            } else {
                socket.join(roomId);
                socket.broadcast.to(roomId).emit(SocketEvent.JoinGame, { roomId, playerName: player });
                this.gameManager.setTimer(roomId);
                this.gameManager.sendTimer(this.sio, roomId, roomId);
            }
        } else {
            roomId = await this.gameManager.createGame({ player: { name: player, id: socket.id }, isMulti: game.isMulti }, mode, game.card);
            this.multiplayerGameManager.addGameWaiting({ gameId: game.card, mode, roomId });
            socket.broadcast.emit(SocketEvent.GetGamesWaiting, { mode, gamesWaiting: this.multiplayerGameManager.getGamesWaiting(mode) });
            socket.emit(SocketEvent.WaitPlayer, roomId);
            socket.join(roomId);
        }
    }

    refreshGames() {
        this.sio.emit(SocketEvent.RefreshGames);
    }

    private handleEndGame(gameId: string, socket: Socket): void {
        const time = this.gameManager.getTime(gameId) as number;
        const playerName = this.gameManager.findPlayer(gameId, socket.id) as string;
        const gameInfo = this.gameManager.getGameInfo(gameId);
        const isMulti = this.gameManager.isGameMultiplayer(gameId) as boolean;

        if (!this.gameManager.isGameCardDeleted(gameId)) {
            this.scoresHandlerService
                .verifyScore((gameInfo as PrivateGameInformation).id as string, { playerName, time, type: ScoreType.Player }, isMulti)
                .then((index) => {
                    this.gameManager.leaveGame(socket.id, gameId);

                    if (isMulti) {
                        socket.broadcast.to(gameId).emit(SocketEvent.Lose);
                    }

                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- index is -1 when not added to the list
                    if (index !== -1) {
                        socket.emit(SocketEvent.Win, { index, time });
                        this.sio.sockets.emit(
                            SocketEvent.EventMessage,
                            this.eventMessageService.sendNewHighScoreMessage({
                                record: { index, time },
                                playerName,
                                gameName: (gameInfo as PrivateGameInformation).name as string,
                                isMulti,
                            }),
                        );
                        return;
                    }

                    socket.emit(SocketEvent.Win);
                    return;
                });
        } else {
            this.gameManager.leaveGame(socket.id, gameId);

            if (isMulti) {
                socket.broadcast.to(gameId).emit(SocketEvent.Lose);
            }

            socket.emit(SocketEvent.Win);
            return;
        }
    }

    getTime() {
        return this.formatTime(new Date());
    }

    private formatTime(date: Date) {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    }
}
