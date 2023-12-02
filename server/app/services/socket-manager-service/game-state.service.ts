/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
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
    constructor(private serverSocket: SocketServer, private gameManager: GameManagerService) {}

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
                const game = this.gameManager.getGame(gameId);
                if (game) {
                    game.makeObservable();
                }
                const joinableGame = this.gameManager.getJoinableGame(gameId);
                this.gameManager.addJoinableGame(gameId);
                if (joinableGame) {
                    this.sio.emit(SocketEvent.ClassicGameCreated, { ...joinableGame, gameId });
                }
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
                    const game = this.gameManager.getGame(gameId);
                    if (game) {
                        game.makeObservable();
                        const joinableGame = this.gameManager.getLimitedJoinableGame(gameId);
                        this.gameManager.addJoinableGame(gameId);
                        this.sio.emit(SocketEvent.LimitedGameCreated, { ...joinableGame, gameId });
                    }
                    this.gameManager.sendTimer(this.sio, gameId, socket.id);
                    const players = this.gameManager.getPlayers(gameId);
                    socket.emit(SocketEvent.Play, {
                        gameId,
                        gameCard: gameCardInfo,
                        data: {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            coords: this.gameManager.getGame(gameId)!.differencesToClear.coords,
                            nbDifferencesLeft: 1,
                            players,
                        },
                    });
                }
            }
        });
        socket.on(SocketEvent.LeaveGame, (gameId: string) => {
            if (!this.gameManager.isGameFound(gameId)) {
                socket.emit(SocketEvent.Error);
                return;
            }
            if (this.gameManager.isObserver(gameId, socket.id)) {
                this.gameManager.removeObserver(gameId, socket.id);
                socket.leave(gameId);
                return;
            }
            if (!this.gameManager.isGameOver(gameId)) {
                this.gameManager.removePlayer(gameId, socket.id);
                if (this.gameManager.onePlayerLeft(gameId)) {
                    socket.broadcast.to(gameId).emit(SocketEvent.Win);
                    socket.leave(gameId);
                    this.gameManager.leaveGame(socket.id, gameId);
                    this.gameManager.deleteTimer(gameId);
                    this.gameManager.removeGame(gameId);
                    if (this.gameManager.isClassic(gameId)) {
                        this.gameManager.removeJoinableGame(gameId);
                        const games = this.gameManager.getJoinableGames();
                        this.sio.emit(SocketEvent.SendingJoinableClassicGames, { games });
                    } else {
                        this.gameManager.removeJoinableLimitedGame(gameId);
                        const games = this.gameManager.getJoinableLimitedGames();
                        this.sio.emit(SocketEvent.SendingJoinableLimitedGames, { games });
                    }
                    this.sio.in(gameId).socketsLeave(gameId);
                }
            } else if (this.gameManager.isGameOver(gameId)) {
                this.gameManager.leaveGame(socket.id, gameId);
                this.gameManager.deleteTimer(gameId);
                this.gameManager.removeGame(gameId);
                if (this.gameManager.isClassic(gameId)) {
                    this.gameManager.removeJoinableGame(gameId);
                    const games = this.gameManager.getJoinableGames();
                    this.sio.emit(SocketEvent.SendingJoinableClassicGames, { games });
                } else {
                    this.gameManager.removeJoinableLimitedGame(gameId);
                    const games = this.gameManager.getJoinableLimitedGames();
                    this.sio.emit(SocketEvent.SendingJoinableLimitedGames, { games });
                }
                this.sio.in(gameId).socketsLeave(gameId);
            } else {
                socket.leave(gameId);
            }
        });
    }
}
