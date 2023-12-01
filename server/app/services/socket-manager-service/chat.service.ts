/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatMessage, ChatRoom, UserRoom } from '@common/chat';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { SocketServer } from './server-socket-manager.service';

interface GameChat {
    chatRoom: ChatRoom;
    users: string[];
}

@Service()
export class ChatSocketManager {
    allRooms: Map<string, ChatRoom> = new Map<string, ChatRoom>();
    gameRooms: Map<string, GameChat> = new Map<string, GameChat>();
    userRooms: Map<string, UserRoom[]> = new Map<string, UserRoom[]>();

    constructor(private server: SocketServer) {
        this.allRooms.set('all', { info: { name: 'all' }, messages: [], users: [] });
        this.allRooms.set('room1', {
            info: { name: 'room1' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room2', {
            info: { name: 'room2' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room3', {
            info: { name: 'room3' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room4', {
            info: { name: 'room4' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room5', {
            info: { name: 'room5' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room6', {
            info: { name: 'room6' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room7', {
            info: { name: 'room7' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room8', {
            info: { name: 'room8' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room9', {
            info: { name: 'room9' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room10', {
            info: { name: 'room10' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room11', {
            info: { name: 'room11' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room12', {
            info: { name: 'room12' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room13', {
            info: { name: 'room13' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room14', {
            info: { name: 'room14' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room15', {
            info: { name: 'room15' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room16', {
            info: { name: 'room16' },
            messages: [],
            users: [],
        });
        this.allRooms.set('room17', {
            info: { name: 'room17' },
            messages: [],
            users: [],
        });
    }

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.InitChat, (userName: string) => {
            const userRooms = this.userRooms.get(userName);
            if (userRooms) {
                userRooms.forEach((room) => {
                    socket.join(room.room);
                });
            } else {
                this.userRooms.set(userName, [
                    {
                        room: 'all',
                        read: false,
                        lastMessage: this.allRooms.get('all')
                            ? this.allRooms.get('all')?.messages[this.allRooms.get('all')!.messages.length - 1]
                            : undefined,
                    },
                ]);
                this.allRooms.get('all')!.users.push(userName);
                socket.join('all');
            }
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName));
            socket.emit(SocketEvent.UpdateAllRooms, Array.from(this.allRooms.keys()));
        });

        socket.on(SocketEvent.Message, (message: ChatMessage) => {
            if (this.allRooms.get(message.room)) {
                this.allRooms.get(message.room)!.users.forEach((user) => {
                    const currentUserRooms = this.userRooms.get(user);
                    this.userRooms.set(
                        user,
                        currentUserRooms!.map((room) => {
                            if (room.room === message.room) {
                                return { room: room.room, read: room.read, lastMessage: message };
                            }
                            return room;
                        }),
                    );
                });
                this.allRooms.get(message.room)?.messages.push(message);
                this.server.sio.to(message.room).emit(SocketEvent.Message, message);
            } else if (this.gameRooms.get(message.room)) {
                this.gameRooms.get(message.room)?.chatRoom.messages.push(message);
                this.server.sio.to(message.room).emit(SocketEvent.Message, message);
            }
        });

        socket.on(SocketEvent.UnreadMessage, (roomName: string, userName: string) => {
            if (this.userRooms.get(userName)) {
                this.userRooms.get(userName)?.forEach((room) => {
                    if (room.room === roomName) {
                        room.read = false;
                    }
                });
            }
            // socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName));
        });

        socket.on(SocketEvent.ReadMessages, (roomName: string, userName: string) => {
            if (this.userRooms.get(userName)) {
                this.userRooms.get(userName)?.forEach((room) => {
                    if (room.room === roomName) {
                        room.read = true;
                    }
                });
            }
            // socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName));
        });

        socket.on(SocketEvent.GetAllRooms, () => {
            socket.emit(
                SocketEvent.UpdateAllRooms,
                Array.from(this.allRooms.values()).map((room: ChatRoom) => room.info),
            );
        });

        socket.on(SocketEvent.GetUserRooms, (userName: string) => {
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName)!);
        });

        socket.on(SocketEvent.GetMessages, (roomId: string) => {
            if (this.allRooms.get(roomId)) {
                socket.emit(SocketEvent.GetMessages, this.allRooms.get(roomId)?.messages);
            } else if (this.gameRooms.get(roomId)) {
                socket.emit(SocketEvent.GetMessages, this.gameRooms.get(roomId)?.chatRoom.messages);
            }
        });

        socket.on(SocketEvent.CreateRoom, (roomName: string, userName: string) => {
            this.createRoom(roomName);
            if (this.userRooms.get(userName)) {
                // const rooms = [roomName];
                this.userRooms.get(userName)!.push({ room: roomName, read: true, lastMessage: undefined });
                socket.join(roomName);
            }
            // else {
            //     this.userRooms.set(userName, [roomName]);
            //     socket.join(roomName);
            // }
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName)!);
            this.server.sio.emit(SocketEvent.UpdateAllRooms, Array.from(this.allRooms.keys()));
        });

        socket.on(SocketEvent.JoinRooms, (roomNames: string[], userName: string) => {
            if (this.userRooms.get(userName)) {
                roomNames.forEach((room) => {
                    this.userRooms.set(userName, [
                        ...this.userRooms.get!(userName)!,
                        { room, read: false, lastMessage: this.allRooms.get(room)!.messages[this.allRooms.get(room)!.messages.length - 1] },
                    ]);
                    socket.join(room);
                });
            }
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName)!);
        });

        socket.on(SocketEvent.LeaveRoom, (roomName: string, userName: string) => {
            if (roomName === 'all') {
                return;
            }
            socket.leave(roomName);
            if (this.userRooms.get(userName)) {
                this.userRooms.set(
                    userName,
                    this.userRooms.get(userName)!.filter((r) => r.room !== roomName),
                );
            }
            if (this.gameRooms.get(roomName)) {
                this.gameRooms.get(roomName)?.users.filter((u) => u !== userName);
                if (this.gameRooms.get(roomName)?.users.length === 0) {
                    this.gameRooms.delete(roomName);
                }
                this.userRooms.set(
                    userName,
                    this.userRooms.get(userName)!.filter((r) => r.room !== roomName),
                );
            }
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName)!);
        });

        socket.on(SocketEvent.DeleteRoom, (roomName: string) => {
            this.server.sio.in(roomName).socketsLeave(roomName);
            this.allRooms.delete(roomName);
            this.userRooms.forEach((rooms, user) => {
                this.userRooms.set(
                    user,
                    rooms.filter((r) => r.room !== roomName),
                );
            });
            this.server.sio.emit(SocketEvent.RoomDeleted);
        });

        socket.on(SocketEvent.UpdateMessagesUsername, (oldName: string, newName: string) => {
            this.updateMessageUsernames(oldName, newName);
        });
    }

    initializeRooms(socket: Socket): void {
        const userRooms = this.userRooms.get(socket.id);
        if (userRooms) {
            userRooms.forEach((room) => {
                socket.join(room.room);
            });
        }
    }

    createRoom(roomName: string): void {
        this.allRooms.set(roomName, {
            info: { name: roomName },
            messages: [],
            users: [],
        });
    }

    createGameChat(roomId: string, user: User, socket: Socket) {
        const roomName = 'Game (' + roomId + ')';
        this.gameRooms.set(roomName, {
            chatRoom: {
                info: { name: roomName },
                messages: [],
                users: [],
            },
            users: [user.name],
        });
        socket.join(roomName);
        if (this.userRooms.get(user.name)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.userRooms.set(user.name, [...this.userRooms.get(user.name)!, { room: roomName, read: false, lastMessage: undefined }]);
            socket.join(roomName);
        }
        socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(user.name)!);
    }

    joinGameChat(roomId: string, user: User, socket: Socket) {
        const roomName = 'Game (' + roomId + ')';
        socket.join(roomName);
        if (this.userRooms.get(user.name)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.userRooms.set(user.name, [
                ...this.userRooms.get(user.name)!,
                {
                    room: roomName,
                    read: false,
                    lastMessage: this.gameRooms.get(roomName)!.chatRoom.messages[this.gameRooms.get(roomName)!.chatRoom.messages.length - 1],
                },
            ]);
            socket.join(roomName);
            this.gameRooms.get(roomId)?.users.push(user.name);
        }
        socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(user.name)!);
    }

    leaveGameChat(user: string) {
        if (this.userRooms.get(user)) {
            this.userRooms.get(user)?.filter((r) => !r.room.startsWith('Game'));
        }
    }

    deleteGameChat(roomName: string) {
        this.server.sio.in(roomName).socketsLeave(roomName);
        this.allRooms.delete(roomName);
        this.userRooms.forEach((rooms, user) => {
            this.userRooms.set(
                user,
                rooms.filter((r) => r.room !== roomName),
            );
        });
        this.server.sio.emit(SocketEvent.RoomDeleted);
    }

    updateMessageUsernames(oldName: string, newName: string) {
        this.allRooms.forEach((room) => {
            room.messages.forEach((message) => {
                if (message.user === oldName) {
                    message.user = newName;
                }
            });
        });
        this.gameRooms.forEach((game) => {
            game.chatRoom.messages.forEach((message) => {
                if (message.user === oldName) {
                    message.user = newName;
                }
            });
        });
    }
}
