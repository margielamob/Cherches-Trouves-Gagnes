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
import { ScoreType } from '@common/score-type';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import { WaitingRoomInfo } from '@common/waiting-room-info';
import * as http from 'http';
import * as LZString from 'lz-string';
import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';
@Service()
export class SocketManagerService {
    private sio: Server;

    // eslint-disable-next-line max-params -- all services are needed
    constructor(
        private gameManager: GameManagerService,
        private readonly multiplayerGameManager: MultiplayerGameManager,
        private eventMessageService: EventMessageService,
        private readonly scoresHandlerService: ScoresHandlerService,
        private limitedTimeService: LimitedTimeGame,
        private cluesService: CluesService,
    ) {}

    set server(server: http.Server) {
        this.sio = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        if (!this.sio) {
            throw new Error('Server instance not set');
        }
        this.sio.on(SocketEvent.Connection, (socket: Socket) => {
            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);

            socket.on(SocketEvent.Disconnect, () => {
                // eslint-disable-next-line no-console
                console.log(`Deconnexion de l'utilisateur avec id : ${socket.id}`);
            });

            socket.on(SocketEvent.CreateClassicGame, async (player: User, card: { id: string; cheatMode: boolean; timer: number }) => {
                await this.createClassicGame(player, card, true, socket);
            });

            socket.on(SocketEvent.JoinClassicGame, async (player: User, roomId: string) => {
                await this.joinClassicGame(player, roomId, socket);
            });

            socket.on(SocketEvent.GetJoinableGames, async () => {
                await this.getJoinableGames();
            });

            socket.on(SocketEvent.LeaveWaitingRoom, (roomId: string) => {
                this.leaveWaitingRoom(roomId, socket);
            });

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

            socket.on(SocketEvent.Ready, (roomId: string) => {
                this.sio.to(roomId).emit(SocketEvent.JoinGame, { roomId });
            });

            socket.on(SocketEvent.JoinGame, (player: string, gameId: string) => {
                if (this.gameManager.isClassic(gameId)) {
                    this.gameManager.sendTimer(this.sio, gameId, socket.id);
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
                            this.eventMessageService.leavingGameMessage(this.gameManager.findPlayer(gameId, socket.id)?.name as string),
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
                this.sio.in(gameId).socketsLeave(gameId);
                this.gameManager.removeJoinableGame(gameId);
                this.sio.emit(SocketEvent.SendingJoinableClassicGames, { games: this.gameManager.getJoinableGames() });
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

            socket.on(SocketEvent.Difference, (differenceCoord: Coordinate, gameId: string, playerName: string) => {
                console.log(playerName);
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
                                this.gameManager.findPlayer(gameId, socket.id)?.name as string,
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
                            this.gameManager.findPlayer(gameId, socket.id)?.name as string,
                            this.gameManager.isGameMultiplayer(gameId),
                        ),
                    );
                // socket.broadcast.to(gameId).emit(SocketEvent.DifferenceFound, this.gameManager.getNbDifferencesFound(differences, gameId, true));
                this.sio
                    .to(gameId)
                    .emit(SocketEvent.DifferenceFound, { data: this.gameManager.getNbDifferencesFound(differences, gameId), playerName });

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
    // eslint-disable-next-line max-params
    async createClassicGame(player: User, card: { id: string; cheatMode: boolean; timer: number }, isMulti: boolean, socket: Socket) {
        const roomId = await this.gameManager.createGame(
            { player: { name: player.name, id: socket.id, avatar: player.avatar }, isMulti },
            GameMode.Classic,
            card.id,
        );
        this.gameManager.setCheatMode(roomId, card.cheatMode);
        this.gameManager.setTimer(roomId, card.timer);
        const players = this.gameManager.getPlayers(roomId) || [];
        socket.broadcast.emit(SocketEvent.ClassicGameCreated, { ...this.gameManager.getJoinableGame(roomId), roomId });
        socket.join(roomId);
        const data: WaitingRoomInfo = { roomId, players, cheatMode: card.cheatMode };
        socket.emit(SocketEvent.WaitPlayer, data);
    }

    async joinClassicGame(player: User, roomId: string, socket: Socket) {
        this.gameManager.addPlayer({ name: player.name, id: socket.id, avatar: player.avatar }, roomId);
        socket.join(roomId);
        const players = this.gameManager.getPlayers(roomId) || [];
        const cheatMode = this.gameManager.isCheatMode(roomId) == null ? false : true;
        console.log(cheatMode);
        const data: WaitingRoomInfo = { roomId, players, cheatMode };
        socket.emit(SocketEvent.WaitPlayer, data);
        socket.broadcast.emit(SocketEvent.UpdatePlayers, data);
    }

    async leaveWaitingRoom(roomId: string, socket: Socket) {
        if (this.gameManager.isGameCreator(roomId, socket.id)) {
            const gameCreator = this.gameManager.findPlayer(roomId, socket.id);
            socket.broadcast.emit(SocketEvent.CreatorLeft, { player: gameCreator });
            this.gameManager.removeJoinableGame(roomId);
            this.sio.emit(SocketEvent.SendingJoinableClassicGames, { games: this.gameManager.getJoinableGames() });
            this.sio.in(roomId).socketsLeave(roomId);
        } else {
            this.gameManager.removePlayer(roomId, socket.id);
            socket.leave(roomId);
            const players = this.gameManager.getPlayers(roomId) || [];
            socket.broadcast.emit(SocketEvent.UpdatePlayers, { roomId, players });
        }
    }

    async getJoinableGames() {
        this.sio.emit(SocketEvent.SendingJoinableClassicGames, { games: this.gameManager.getJoinableGames() });
    }

    refreshGames() {
        this.sio.emit(SocketEvent.RefreshGames);
    }

    endGame(roomId: string) {
        this.gameManager.removeGame(roomId);
    }

    private handleEndGame(gameId: string, socket: Socket): void {
        const time = this.gameManager.getTime(gameId) as number;
        const playerName = this.gameManager.findPlayer(gameId, socket.id)?.name as string;
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
}
