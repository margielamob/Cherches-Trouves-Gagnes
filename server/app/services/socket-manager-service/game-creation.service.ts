/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { ChatSocketManager } from './chat.service';
import { SocketServer } from './server-socket-manager.service';

@Service()
export class GameCreationManager {
    constructor(private serverSocket: SocketServer, private gameManager: GameManagerService, chat: ChatSocketManager) {}

    private get sio(): io.Server {
        return this.serverSocket.sio;
    }
    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.CreateClassicGame, async (player: User, card: { id: string; cheatMode: boolean; timer: number }) => {
            // create new chat room for game
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
        socket.emit(SocketEvent.WaitPlayer, { roomId, players });
    }

    async joinClassicGame(player: User, roomId: string, socket: Socket) {
        this.gameManager.addPlayer({ name: player.name, id: socket.id, avatar: player.avatar }, roomId);
        socket.join(roomId);
        const players = this.gameManager.getPlayers(roomId) || [];
        const isCheatMode = this.gameManager.isCheatMode(roomId);
        socket.emit(SocketEvent.WaitPlayer, { roomId, players, isCheatMode });
        socket.broadcast.emit(SocketEvent.UpdatePlayers, { roomId, players });
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
}
