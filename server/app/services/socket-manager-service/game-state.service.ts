/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { EventMessageService } from '@app/services/message-event-service/message-event.service';
import { BASE_64_HEADER } from '@common/base64';
import { PublicGameInformation } from '@common/game-information';
import { SocketEvent } from '@common/socket-event';
import * as LZString from 'lz-string';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { SocketServer } from './server-socket-manager.service';

@Service()
export class GameStateManager {
    // eslint-disable-next-line max-params
    constructor(private serverSocket: SocketServer, private gameManager: GameManagerService, private eventMessageService: EventMessageService) {}

    private get sio(): io.Server {
        return this.serverSocket.sio;
    }

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.Ready, (roomId: string) => {
            this.sio.to(roomId).emit(SocketEvent.JoinGame, { roomId });
        });

        socket.on(SocketEvent.JoinGame, (player: string, gameId: string) => {
            if (this.gameManager.isClassic(gameId)) {
                this.gameManager.sendTimer(this.sio, gameId, socket.id);
                this.sio.to(gameId).emit(SocketEvent.Play, gameId);
                this.gameManager.removeJoinableGame(gameId);
                this.sio.emit(SocketEvent.SendingJoinableClassicGames, { games: this.gameManager.getJoinableGames() });
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
        });
    }
}
