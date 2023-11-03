/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatMessage, ChatRoom } from '@common/chat';
import { SocketEvent } from '@common/socket-event';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { SocketServer } from './server-socket-manager.service';

@Service()
export class ChatSocketManager {
    allRooms: Map<string, ChatRoom> = new Map<string, ChatRoom>();
    userRooms: Map<string, string[]> = new Map<string, string[]>();

    constructor(private server: SocketServer) {
        this.allRooms.set('all', { info: { name: 'all' }, messages: [] });
        this.allRooms.set('room1', { info: { name: 'room1' }, messages: [] });
        this.allRooms.set('room2', { info: { name: 'room2' }, messages: [] });
        this.allRooms.set('room3', { info: { name: 'room3' }, messages: [] });
        this.allRooms.set('room4', { info: { name: 'room4' }, messages: [] });
        this.allRooms.set('room5', { info: { name: 'room5' }, messages: [] });
        this.allRooms.set('room6', { info: { name: 'room6' }, messages: [] });
    }

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        // this.addRoomsToUser(socket, ['all', 'room1', 'room2']);
        // this.initializeRooms(socket);

        socket.on(SocketEvent.InitChat, (userName: string) => {
            console.log(userName);
            const userRooms = this.userRooms.get(userName);
            if (userRooms) {
                console.log('existing user');
                userRooms.forEach((room) => {
                    socket.join(room);
                });
            } else {
                console.log('new user');
                this.userRooms.set(userName, ['all']);
                ['all'].forEach((room) => {
                    socket.join(room);
                });
            }
            console.log(this.userRooms.keys());
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName));
            socket.emit(SocketEvent.UpdateAllRooms, Array.from(this.allRooms.keys()));
        });

        socket.on(SocketEvent.Message, (message: ChatMessage) => {
            console.log(message);
            this.allRooms.get(message.room)?.messages.push(message);
            this.server.sio.to(message.room).emit(SocketEvent.Message, message);
        });

        socket.on(SocketEvent.GetAllRooms, () => {
            console.log(Array.from(this.allRooms.keys()));
            socket.emit(
                SocketEvent.UpdateAllRooms,
                Array.from(this.allRooms.values()).map((room: ChatRoom) => room.info),
            );
        });

        socket.on(SocketEvent.GetUserRooms, (userName: string) => {
            console.log('getuserroom : ' + this.userRooms.get(userName));
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName));
        });

        socket.on(SocketEvent.GetMessages, (roomId: string) => {
            socket.emit(SocketEvent.GetMessages, this.allRooms.get(roomId)?.messages);
        });

        socket.on(SocketEvent.CreateRoom, (roomName: string) => {
            console.log(roomName);
            this.createRoom(roomName);
            this.addRoomsToUser(socket, [roomName]);
            // socket.emit(SocketEvent.RoomCreated, {
            //     all: Array.from(this.allRooms.keys()),
            //     user: this.userRooms.get(socket.id),
            // });
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(socket.id));
            socket.broadcast.emit(SocketEvent.UpdateAllRooms, Array.from(this.allRooms.keys()));
        });

        socket.on(SocketEvent.JoinRooms, (roomNames: string[], userName: string) => {
            console.log('joinRooms : ' + roomNames);
            if (this.userRooms.get(userName)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.userRooms.set(userName, [...this.userRooms.get(userName)!, ...roomNames]);
                roomNames.forEach((room) => {
                    socket.join(room);
                });
            }
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName));
        });

        socket.on(SocketEvent.LeaveRoom, (roomName: string, userName: string) => {
            console.log('leaveRoom : ' + roomName);
            if (roomName === 'all') {
                return;
            }
            socket.leave(roomName);
            if (this.userRooms.get(userName)) {
                this.userRooms.set(
                    userName,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it exists
                    this.userRooms.get(userName)!.filter((r) => r !== roomName),
                );
            }
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName));
        });

        socket.on(SocketEvent.DeleteRoom, (roomName: string) => {
            this.server.sio.in(roomName).socketsLeave(roomName);
            this.allRooms.delete(roomName);
            this.userRooms.forEach((rooms, user) => {
                this.userRooms.set(
                    user,
                    rooms.filter((r) => r !== roomName),
                );
                console.log(this.userRooms.get(user));
            });
            this.server.sio.emit(SocketEvent.RoomDeleted);
        });
    }

    initializeRooms(socket: Socket): void {
        const userRooms = this.userRooms.get(socket.id);
        if (userRooms) {
            userRooms.forEach((room) => {
                socket.join(room);
            });
        }
    }

    createRoom(roomName: string): void {
        this.allRooms.set(roomName, { info: { name: roomName }, messages: [] });
    }

    addRoomsToUser(socket: Socket, rooms: string[]): void {
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
