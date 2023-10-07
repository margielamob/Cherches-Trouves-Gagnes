/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { EventMessageService } from '@app/services/message-event-service/message-event.service';
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
export class GameStateManager {
    // eslint-disable-next-line max-params
    constructor(
        private serverSocket: SocketServer,
        private gameManager: GameManagerService,
        private readonly multiplayerGameManager: MultiplayerGameManager,
        private eventMessageService: EventMessageService,
    ) {}

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.AcceptPlayer, (roomId: string, opponentsRoomId: string, playerName: string) => {
            const request = this.multiplayerGameManager.getRequest(roomId);
            if (!this.multiplayerGameManager.playersRequestExists(roomId, opponentsRoomId) || !request) {
                socket.emit(SocketEvent.PlayerLeft);
                return;
            }

            this.multiplayerGameManager.removeGameWaiting(roomId);
            this.serverSocket.sio.sockets.emit(SocketEvent.GetGamesWaiting, {
                mode: GameMode.Classic,
                gamesWaiting: this.multiplayerGameManager.getGamesWaiting(GameMode.Classic),
            });

            this.serverSocket.sio.to(opponentsRoomId).emit(SocketEvent.JoinGame, { roomId, playerName });
            socket.join(roomId);
            for (const player of request) {
                if (this.multiplayerGameManager.isNotAPlayersRequest(player.id, opponentsRoomId)) {
                    this.serverSocket.sio.to(player.id).emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.gameStarted);
                }
            }
            this.multiplayerGameManager.deleteAllRequests(roomId);
            this.gameManager.setTimer(roomId);
            this.gameManager.sendTimer(this.serverSocket.sio, roomId, roomId);
        });

        socket.on(SocketEvent.RejectPlayer, (roomId: string, opponentsRoomId: string) => {
            this.multiplayerGameManager.deleteFirstRequest(roomId);
            if (this.multiplayerGameManager.theresARequest(roomId)) {
                const newPlayerRequest = this.multiplayerGameManager.getNewRequest(roomId);
                this.serverSocket.sio.to(roomId).emit(SocketEvent.RequestToJoin, newPlayerRequest);
            }

            this.serverSocket.sio.to(opponentsRoomId).emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.rejected);
        });

        socket.on(SocketEvent.JoinGame, (player: string, gameId: string) => {
            this.gameManager.addPlayer({ name: player, id: socket.id }, gameId);
            socket.join(gameId);
            socket.broadcast.to(gameId).emit(SocketEvent.JoinGame, { roomId: gameId, playerName: player });
            if (this.gameManager.isClassic(gameId)) {
                this.serverSocket.sio.to(gameId).emit(SocketEvent.Play, gameId);
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

        socket.on(SocketEvent.LeaveWaiting, (roomId: string, gameCard: string) => {
            if (roomId) {
                const request = this.multiplayerGameManager.getRequest(roomId);
                if (request) {
                    for (const player of request) {
                        this.serverSocket.sio.to(player.id).emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.playerQuit);
                    }
                }
                this.multiplayerGameManager.removeGameWaiting(roomId);
                return;
            }

            this.multiplayerGameManager.deleteRequest(this.multiplayerGameManager.getRoomIdWaiting(gameCard), socket.id);
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
    }
}
