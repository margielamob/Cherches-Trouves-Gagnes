/* eslint-disable @typescript-eslint/no-explicit-any */
import { SocketEvent } from '@common/socket-event';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { SocketServer } from './server-socket-manager.service';

@Service()
export class ChatSocketManager {
    allRooms: Map<string, string[]> = new Map<string, string[]>();
    userRooms: Map<string, string[]> = new Map<string, string[]>();

    constructor(private server: SocketServer) {
        this.allRooms.set('all', []);
        this.allRooms.set('room1', []);
        this.allRooms.set('room2', []);
        this.allRooms.set('room3', []);
        this.allRooms.set('room4', []);
        this.allRooms.set('room5', []);
        this.allRooms.set('room6', []);
    }

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        this.addRoomsToUser(socket, ['all', 'room1', 'room2']);
        this.initializeRooms(socket);
        socket.on(SocketEvent.Message, (message: string, roomId: string) => {
            console.log(message, roomId);
            this.server.sio.to(roomId).emit(SocketEvent.Message, { message, roomId });
        });

        socket.on(SocketEvent.GetRooms, () => {
            console.log(Array.from(this.allRooms.keys()));
            socket.emit(SocketEvent.GetRooms, Array.from(this.allRooms.keys()));
        });

        socket.on(SocketEvent.GetUserRooms, () => {
            console.log('getuserroom : ' + this.userRooms.get(socket.id));
            socket.emit(SocketEvent.GetUserRooms, this.userRooms.get(socket.id));
        });

        socket.on(SocketEvent.GetMessages, (roomId: string) => {
            socket.emit(SocketEvent.GetMessages, this.allRooms.get(roomId));
        });

        socket.on(SocketEvent.CreateRoom, (roomName: string) => {
            console.log(roomName);
            this.createRoom(roomName);
            this.addRoomsToUser(socket, [roomName]);
            this.server.sio.emit(SocketEvent.RoomCreated, {
                all: Array.from(this.allRooms.keys()),
                user: this.userRooms.get(socket.id),
            });
        });

        socket.on(SocketEvent.JoinRooms, (roomNames: string[]) => {
            console.log(roomNames);
            this.addRoomsToUser(socket, roomNames);
        });
    }

    initializeRooms(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        const userRooms = this.userRooms.get(socket.id);
        if (userRooms) {
            userRooms.forEach((room) => {
                socket.join(room);
            });
        }
    }

    createRoom(roomName: string): void {
        this.allRooms.set(roomName, []);
    }

    addRoomsToUser(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, rooms: string[]): void {
        const userRooms = this.userRooms.get(socket.id);
        if (userRooms) {
            this.userRooms.set(socket.id, [...userRooms, ...rooms]);
            rooms.forEach((room) => {
                socket.join(room);
            });
        } else {
            this.userRooms.set(socket.id, rooms);
            rooms.forEach((room) => {
                socket.join(room);
            });
        }
    }

    removeRoomFromUser(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, room: string): void {
        const userRooms = this.userRooms.get(socket.id);
        if (userRooms) {
            this.userRooms.set(
                socket.id,
                userRooms.filter((r) => r !== room),
            );
            socket.leave(room);
        }
    }

    // deleteRoom(room: string): void {
    //     this.allRooms.delete(room);
    //     this.server.sio.in(room).allSockets().then((sockets) => {
    //         sockets.forEach((socket) => {
    //             this.removeRoomFromUser(socket, room);
    // }
}
