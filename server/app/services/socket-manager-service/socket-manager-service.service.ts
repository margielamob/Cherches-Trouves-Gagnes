/* eslint-disable max-lines */
// import { EventMessageService } from '@app/services//message-event-service/message-event.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { LimitedTimeGame } from '@app/services/limited-time-game-service/limited-time-game.service';
import { MultiplayerGameManager } from '@app/services/multiplayer-game-manager/multiplayer-game-manager.service';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import { ChatSocketManager } from './chat.service';
import { GameCreationManager } from './game-creation.service';
import { GameStateManager } from './game-state.service';
import { GamePlayManager } from './gameplay.service';
import { SocketServer } from './server-socket-manager.service';
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
    ) {}

    handleSockets(): void {
        if (!this.serverSocket.sio) {
            throw new Error('Server instance not set');
        }
        this.serverSocket.sio.on(SocketEvent.Connection, (socket: Socket) => {
            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);

            this.chatSocketManager.handleSockets(socket);
            this.gameCreationManager.handleSockets(socket);
            this.gameStateManager.handleSockets(socket);
            this.gamePlayManager.handleSockets(socket);

            socket.on(SocketEvent.Disconnect, () => {
                // eslint-disable-next-line no-console
                console.log(`Deconnexion de l'utilisateur avec id : ${socket.id}`);
            });

            socket.on(SocketEvent.GetGamesWaiting, (mode: GameMode) => {
                socket.emit(SocketEvent.GetGamesWaiting, { mode, gamesWaiting: this.multiplayerGameManager.getGamesWaiting(mode) });
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

            socket.on(SocketEvent.GamesDeleted, () => {
                this.limitedTimeService.deleteAllGames();
                this.gameManager.allGameCardsDeleted();
                this.serverSocket.sio.emit(SocketEvent.RejectPlayer, this.multiplayerGameManager.rejectMessages.allGamesDeleted);
                for (const gameId of this.multiplayerGameManager.getGamesWaiting(GameMode.Classic)) {
                    const roomId = this.multiplayerGameManager.getRoomIdWaiting(gameId);
                    this.multiplayerGameManager.deleteAllRequests(roomId);
                }
            });
        });
    }

    refreshGames() {
        this.serverSocket.sio.emit(SocketEvent.RefreshGames);
    }
}
