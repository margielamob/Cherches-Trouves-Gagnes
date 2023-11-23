/* eslint-disable max-lines */
// import { EventMessageService } from '@app/services//message-event-service/message-event.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { LimitedTimeGame } from '@app/services/limited-time-game-service/limited-time-game.service';
import { MultiplayerGameManager } from '@app/services/multiplayer-game-manager/multiplayer-game-manager.service';
import { Coordinate } from '@common/coordinate';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';
import { ChatSocketManager } from './chat.service';
import { GameCreationManager } from './game-creation.service';
import { GamePlayManager } from './game-play-manager.service';
import { GameStateManager } from './game-state.service';
import { SocketServer } from './server-socket-manager.service';
import { UserManager } from './user-manager.service';
@Service()
export class SocketManagerService {
    // eslint-disable-next-line max-params -- all services are needed
    constructor(
        private serverSocket: SocketServer,
        private gameManager: GameManagerService,
        private readonly multiplayerGameManager: MultiplayerGameManager,
        private limitedTimeService: LimitedTimeGame,
        private chatSocketManager: ChatSocketManager,
        private gameCreationManager: GameCreationManager,
        private gameStateManager: GameStateManager,
        private gamePlayManager: GamePlayManager,
        private userManager: UserManager,
    ) {}

    private get sio(): Server {
        if (!this.serverSocket.sio) {
            throw new Error('Server instance not set');
        }
        return this.serverSocket.sio;
    }

    handleSockets(): void {
        if (!this.serverSocket.sio) {
            throw new Error('Server instance not set');
        }
        this.serverSocket.sio.on(SocketEvent.Connection, (socket: Socket) => {
            this.chatSocketManager.handleSockets(socket);
            this.gameCreationManager.handleSockets(socket);
            this.gameStateManager.handleSockets(socket);
            this.gamePlayManager.handleSockets(socket);
            this.userManager.handleSockets(socket);
            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            socket.on(SocketEvent.Disconnect, () => {
                // eslint-disable-next-line no-console
                console.log(`Deconnexion de l'utilisateur avec id : ${socket.id}`);
            });

            // socket.on(SocketEvent.Message, (message: string, roomId: string) => {
            //     socket.broadcast.to(roomId).emit(SocketEvent.Message, message);
            // });

            socket.on(SocketEvent.GetGamesWaiting, (mode: GameMode) => {
                const result = { mode, gamesWaiting: this.multiplayerGameManager.getGamesWaiting(mode) };
                socket.emit(SocketEvent.GetGamesWaiting, result);
            });

            socket.on(SocketEvent.GameDeleted, (gameId: string) => {
                this.limitedTimeService.deleteGame(gameId);
                this.gameManager.gameCardDeletedHandle(gameId);
                if (this.multiplayerGameManager.isGameWaiting(gameId, undefined)) {
                    const roomId = this.multiplayerGameManager.getRoomIdWaiting(gameId);
                    this.serverSocket.sio.to(roomId).emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.deletedGame);
                    const request = this.multiplayerGameManager.getRequest(roomId);
                    if (request) {
                        for (const player of request) {
                            this.serverSocket.sio
                                .to(player.id)
                                .emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.deletedGame);
                        }
                    }
                }
            });

            socket.on(SocketEvent.EndedTime, (time: number) => {
                socket.emit(SocketEvent.EndedTime, { time });
            });

            socket.on(SocketEvent.GamesDeleted, () => {
                this.limitedTimeService.deleteAllGames();
                this.gameManager.allGameCardsDeleted();
                this.serverSocket.sio.emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.allGamesDeleted);
                for (const gameId of this.multiplayerGameManager.getGamesWaiting(GameMode.Classic)) {
                    const roomId = this.multiplayerGameManager.getRoomIdWaiting(gameId);
                    this.multiplayerGameManager.deleteAllRequests(roomId);
                }
            });

            socket.on(SocketEvent.StartClock, (timer: number, roomId: string) => {
                socket.to(roomId).emit(SocketEvent.StartClock, { timer });
            });

            socket.on(SocketEvent.StartLimitedClock, (timer: number, roomId: string) => {
                socket.to(roomId).emit(SocketEvent.StartLimitedClock, { timer });
            });
            socket.on(SocketEvent.GameStarted, (gameId: string) => {
                socket.emit(SocketEvent.GameStarted, gameId);
            });

            socket.on(SocketEvent.Cheat, () => {
                socket.emit(SocketEvent.Cheat);
            });

            socket.on(SocketEvent.Timer, (timer: number, roomId: string) => {
                socket.to(roomId).emit(SocketEvent.Timer, { timer });
            });

            socket.on(SocketEvent.DifferenceFoundReplay, (gameId: string, differenceCoord: Coordinate) => {
                this.gameManager.isDifference(gameId, socket.id, differenceCoord);
            });

            socket.on(SocketEvent.LeavingArena, (gameId: string) => {
                const game = this.gameManager.findGame(gameId);
                game?.incrementLeftArena();
                if (game?.isArenaEmpty()) {
                    this.gameManager.discardGame(gameId);
                }
            });
        });
    }

    refreshGames() {
        this.sio.emit(SocketEvent.RefreshGames);
    }

    endGame(roomId: string) {
        this.gameManager.removeGame(roomId);
    }
}
