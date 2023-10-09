/* eslint-disable @typescript-eslint/no-explicit-any */
import { SocketEvent } from '@common/socket-event';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { SocketServer } from './server-socket-manager.service';

@Service()
export class ChatSocketManager {
    rooms: Map<string, string[]> = new Map<string, string[]>();

    constructor(private server: SocketServer) {
        this.rooms.set('all', []);
        this.rooms.set('room1', []);
        this.rooms.set('room2', []);
    }

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        this.initializeRooms(Array.from(this.rooms.keys()), socket);
        socket.on(SocketEvent.Message, (message: string, roomId: string) => {
            this.server.sio.to(roomId).emit(SocketEvent.Message, { message, roomId });
        });

        socket.on(SocketEvent.GetRooms, () => {
            socket.emit(SocketEvent.GetRooms, Array.from(this.rooms.keys()));
        });

        socket.on(SocketEvent.GetMessages, (roomId: string) => {
            socket.emit(SocketEvent.GetMessages, this.rooms.get(roomId));
        });
    }

    initializeRooms(rooms: string[], socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        rooms.forEach((room) => {
            socket.join(room);
        });
    }
}
