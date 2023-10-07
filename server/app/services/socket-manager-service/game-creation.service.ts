/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { MultiplayerGameManager } from '@app/services/multiplayer-game-manager/multiplayer-game-manager.service';
import { BASE_64_HEADER } from '@common/base64';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import * as LZString from 'lz-string';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { SocketServer } from './server-socket-manager.service';

@Service()
export class GameCreationManager {
    constructor(
        private serverSocket: SocketServer,
        private gameManager: GameManagerService,
        private readonly multiplayerGameManager: MultiplayerGameManager,
    ) {}

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(
            SocketEvent.CreateGame,
            async (player: string, mode: GameMode, game: { card: string; isMulti: boolean }) => await this.createGameSolo(player, mode, game, socket),
        );

        socket.on(
            SocketEvent.CreateGameMulti,
            async (player: string, mode: GameMode, game: { card: string; isMulti: boolean }) =>
                await this.createGameMulti(player, mode, game, socket),
        );
    }

    // eslint-disable-next-line max-params -- absolutely need all the params
    async createGameSolo(player: string, mode: GameMode, game: { card: string; isMulti: boolean }, socket: io.Socket) {
        const id = await this.gameManager.createGame({ player: { name: player, id: socket.id }, isMulti: game.isMulti }, mode, game.card);
        socket.join(id);
        this.gameManager.setTimer(id);
        this.gameManager.sendTimer(this.serverSocket.sio, id, socket.id);
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
    async createGameMulti(player: string, mode: GameMode, game: { card: string; isMulti: boolean }, socket: io.Socket) {
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
                    this.serverSocket.sio
                        .to(this.multiplayerGameManager.getRoomIdWaiting(game.card))
                        .emit(SocketEvent.RequestToJoin, { name: player, id: socket.id });
                }
            } else {
                socket.join(roomId);
                socket.broadcast.to(roomId).emit(SocketEvent.JoinGame, { roomId, playerName: player });
                this.gameManager.setTimer(roomId);
                this.gameManager.sendTimer(this.serverSocket.sio, roomId, roomId);
            }
        } else {
            roomId = await this.gameManager.createGame({ player: { name: player, id: socket.id }, isMulti: game.isMulti }, mode, game.card);
            this.multiplayerGameManager.addGameWaiting({ gameId: game.card, mode, roomId });
            socket.broadcast.emit(SocketEvent.GetGamesWaiting, { mode, gamesWaiting: this.multiplayerGameManager.getGamesWaiting(mode) });
            socket.emit(SocketEvent.WaitPlayer, roomId);
            socket.join(roomId);
        }
    }
}
