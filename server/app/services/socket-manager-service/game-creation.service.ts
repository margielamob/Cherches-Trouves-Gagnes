/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { Coordinate } from '@common/coordinate';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import { WaitingRoomInfo } from '@common/waiting-room-info';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { ChatSocketManager } from './chat.service';
import { SocketServer } from './server-socket-manager.service';
@Service()
export class GameCreationManager {
    constructor(private serverSocket: SocketServer, private gameManager: GameManagerService, private chat: ChatSocketManager) {}

    private get sio(): io.Server {
        return this.serverSocket.sio;
    }
    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.CreateClassicGame, async (player: User, card: { id: string; cheatMode: boolean; timer: number }) => {
            const roomId = await this.createClassicGame(player, card, true, socket);
            this.chat.createGameChat(roomId, player, socket);
        });

        socket.on(SocketEvent.CreateLimitedGame, async (player: User, card: { id: string; timer: number; bonus: number }) => {
            const roomId = await this.createLimitedGame(player, card, true, socket);
            this.chat.createGameChat(roomId, player, socket);
        });

        socket.on(SocketEvent.JoinClassicGame, async (player: User, roomId: string) => {
            await this.joinClassicGame(player, roomId, socket);
            this.chat.joinGameChat(roomId, player, socket);
        });

        socket.on(SocketEvent.GetJoinableGames, async () => {
            await this.getJoinableGames();
        });

        socket.on(SocketEvent.GetLimitedTimeGames, async () => {
            await this.getLimitedTimeGames();
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
        const data: WaitingRoomInfo = { roomId, players, cheatMode: card.cheatMode };
        socket.emit(SocketEvent.WaitPlayer, data);
        return roomId;
    }

    // eslint-disable-next-line max-params
    async createLimitedGame(player: User, card: { id: string; timer: number; bonus: number }, isMulti: boolean, socket: Socket) {
        const roomId = await this.gameManager.createGame(
            { player: { name: player.name, id: socket.id, avatar: player.avatar }, isMulti },
            GameMode.LimitedTime,
            card.id,
        );
        socket.broadcast.emit(SocketEvent.LimitedGameCreated, { ...this.gameManager.getLimitedJoinableGame(roomId), roomId });
        const players = this.gameManager.getLimitedTimeGamePlayers(roomId) || [];
        const data: WaitingRoomInfo = { roomId, players, cheatMode: false };
        socket.emit(SocketEvent.WaitPlayer, data);
        this.gameManager.getGame(roomId)!.bonusTime = card.bonus;
        this.gameManager.setTimer(roomId, card.timer);
        socket.join(roomId);
        const newDifferences = this.removeRandomDifference(this.gameManager.getGameInfo(roomId)!.differences);
        this.gameManager.getGame(roomId)!.differencesToClear.coords = newDifferences.newDifferences;
        this.gameManager.getGameInfo(roomId)!.differences = [this.gameManager.getGameInfo(roomId)!.differences[newDifferences.randomIndex]];
        return roomId;
    }

    removeRandomDifference(differences: any[][]): { newDifferences: Coordinate[][]; randomIndex: number } {
        if (differences.length === 0) return { newDifferences: [], randomIndex: 0 };
        const randomIndex = Math.floor(Math.random() * differences.length);
        const newDifferences = differences.filter((_, index) => index !== randomIndex);
        return { newDifferences, randomIndex };
    }

    async joinClassicGame(player: User, roomId: string, socket: Socket) {
        this.gameManager.addPlayer({ name: player.name, id: socket.id, avatar: player.avatar }, roomId);
        socket.join(roomId);
        const players = this.gameManager.getPlayers(roomId) || [];
        const cheatMode = this.gameManager.isCheatMode(roomId);
        const data: WaitingRoomInfo = { roomId, players, cheatMode };
        socket.emit(SocketEvent.WaitPlayer, data);
        socket.broadcast.to(roomId).emit(SocketEvent.UpdatePlayers, data);
        if (this.gameManager.isLastPlayer(roomId)) {
            this.gameManager.setWasLastPlayer(roomId, true);
            if (this.gameManager.isClassic(roomId)) {
                this.gameManager.removeJoinableGame(roomId);
                const games = this.gameManager.getJoinableGames();
                this.sio.emit(SocketEvent.SendingJoinableClassicGames, { games });
            } else {
                this.gameManager.removeJoinableLimitedGame(roomId);
                const games = this.gameManager.getJoinableLimitedGames();
                this.sio.emit(SocketEvent.SendingJoinableLimitedGames, { games });
            }
        }
    }

    async leaveWaitingRoom(roomId: string, socket: Socket) {
        if (this.gameManager.isGameCreator(roomId, socket.id)) {
            const gameCreator = this.gameManager.findPlayer(roomId, socket.id);
            socket.broadcast.to(roomId).emit(SocketEvent.CreatorLeft, { player: gameCreator });
            if (this.gameManager.isClassic(roomId)) {
                this.gameManager.removeJoinableGame(roomId);
                this.sio.emit(SocketEvent.SendingJoinableClassicGames, { games: this.gameManager.getJoinableGames() });
            } else {
                this.gameManager.removeJoinableLimitedGame(roomId);
                this.sio.emit(SocketEvent.SendingJoinableLimitedGames, { games: this.gameManager.getJoinableLimitedGames() });
            }
            this.gameManager.discardGame(roomId);
            this.sio.in(roomId).socketsLeave(roomId);
        } else {
            this.gameManager.removePlayer(roomId, socket.id);
            socket.leave(roomId);
            const players = this.gameManager.getPlayers(roomId) || [];
            if (this.gameManager.wasLastPlayer(roomId)) {
                this.gameManager.setWasLastPlayer(roomId, false);
                const game = this.gameManager.getGame(roomId);
                if (game) {
                    this.gameManager.addJoinableGame(roomId);
                    if (this.gameManager.isClassic(roomId)) {
                        this.sio.emit(SocketEvent.ClassicGameCreated, { ...this.gameManager.getJoinableGame(roomId), roomId });
                    } else {
                        this.sio.emit(SocketEvent.ClassicGameCreated, { ...this.gameManager.getLimitedJoinableGame(roomId), roomId });
                    }
                }
            }
            socket.broadcast.to(roomId).emit(SocketEvent.UpdatePlayers, { roomId, players });
        }
    }

    async getLimitedTimeGames() {
        const games = this.gameManager.getJoinableLimitedGames();
        console.log(games);
        this.sio.emit(SocketEvent.SendingJoinableLimitedGames, { games });
    }
    async getJoinableGames() {
        const games = this.gameManager.getJoinableGames();
        this.sio.emit(SocketEvent.SendingJoinableClassicGames, { games });
    }
}
