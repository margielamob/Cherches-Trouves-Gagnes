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
    }

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.InitChat, (userName: string) => {
            console.log('initChat : ' + userName);
            const userRooms = this.userRooms.get(userName);
            if (userRooms) {
                console.log('existing user');
                userRooms.forEach((room) => {
                    socket.join(room.room);
                });
            } else {
                console.log('new user');
                this.userRooms.set(userName, [
                    {
                        room: 'all',
                        read: false,
                        lastMessage: this.allRooms.get('all')
                            ? this.allRooms.get('all')?.messages[this.allRooms.get('all')!.messages.length - 1]
                            : undefined,
                    },
                ]);
                socket.join('all');
            }
            console.log(this.userRooms.keys());
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName));
            socket.emit(SocketEvent.UpdateAllRooms, Array.from(this.allRooms.keys()));
        });

        socket.on(SocketEvent.Message, (message: ChatMessage) => {
            console.log('message : ' + message.message + ' ' + message.room + ' ' + message.user);
            if (this.allRooms.get(message.room)) {
                // get all socket in room
                this.server.sio
                    .in(message.room)
                    .fetchSockets()
                    .then((sockets) => {
                        console.log('sockets in room : ' + sockets.map((s) => s.id));
                    });
                this.allRooms.get(message.room)!.users.forEach((user) => {
                    this.userRooms.get(user)![this.userRooms.get(user)!.findIndex((room) => room.room === message.room)].lastMessage = message;
                    // this.userRooms.set(
                    //     user,
                    //     this.userRooms.get(user)!.map((room) => {
                    //         if (room.room === message.room) {
                    //             return { ...room, lastMessage: message };
                    //         }
                    //         return room;
                    //     }),
                    // );
                });
                this.allRooms.get(message.room)?.messages.push(message);
                this.server.sio.to(message.room).emit(SocketEvent.Message, message);
            } else if (this.gameRooms.get(message.room)) {
                console.log('game room');
                this.gameRooms.get(message.room)?.chatRoom.messages.push(message);
                this.server.sio.to(message.room).emit(SocketEvent.Message, message);
            }
        });

        socket.on(SocketEvent.UnreadMessage, (roomName: string, userName: string) => {
            console.log('unreadmessage : ' + roomName);
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
            console.log('readmessages : ' + roomName);
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
            console.log('getallroom : ' + Array.from(this.allRooms.keys()));
            socket.emit(
                SocketEvent.UpdateAllRooms,
                Array.from(this.allRooms.values()).map((room: ChatRoom) => room.info),
            );
        });

        socket.on(SocketEvent.GetUserRooms, (userName: string) => {
            console.log('getuserroom : ' + this.userRooms.get(userName));
            socket.emit(SocketEvent.UpdateUserRooms, this.userRooms.get(userName)!);
        });

        socket.on(SocketEvent.GetMessages, (roomId: string) => {
            console.log('getmessages : ' + roomId);
            if (this.allRooms.get(roomId)) {
                socket.emit(SocketEvent.GetMessages, this.allRooms.get(roomId)?.messages);
            } else if (this.gameRooms.get(roomId)) {
                socket.emit(SocketEvent.GetMessages, this.gameRooms.get(roomId)?.chatRoom.messages);
            }
        });

        socket.on(SocketEvent.CreateRoom, (roomName: string, userName: string) => {
            console.log('createRoom : ' + roomName);
            this.createRoom(roomName);
            if (this.userRooms.get(userName)) {
                // const rooms = [roomName];
                this.userRooms.get(userName)!.push({ room: roomName, read: true, lastMessage: undefined });
                console.log(this.userRooms.get(userName));
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
            console.log('joinRooms : ' + roomNames);
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
            console.log('leaveRoom : ' + roomName);
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
            console.log('deleteRoom : ' + roomName);
            this.server.sio.in(roomName).socketsLeave(roomName);
            this.allRooms.delete(roomName);
            this.userRooms.forEach((rooms, user) => {
                this.userRooms.set(
                    user,
                    rooms.filter((r) => r.room !== roomName),
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
        console.log('createGameChat');
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
        console.log('leaveGameChat');
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
            console.log(this.userRooms.get(user));
        });
        this.server.sio.emit(SocketEvent.RoomDeleted);
    }
}
