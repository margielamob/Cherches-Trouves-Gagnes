/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { ChatSocketManager } from './chat.service';

@Service()
export class UserManager {
    usersSocket: Map<string, User> = new Map<string, User>();

    constructor(private chat: ChatSocketManager) {}

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.Login, (user: User) => {
            this.login(user, socket);
        });

        socket.on(SocketEvent.Disconnect, () => {
            this.logout(socket);
        });
    }

    login(user: User, socket: Socket) {
        this.usersSocket.set(socket.id, user);
    }

    logout(socket: Socket) {
        this.chat.leaveGameChat(this.usersSocket.get(socket.id)?.name || '');
        this.usersSocket.delete(socket.id);
    }
}
