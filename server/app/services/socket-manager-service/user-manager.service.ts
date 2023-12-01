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
    users: Map<string, User> = new Map<string, User>();

    constructor(private chat: ChatSocketManager) {}

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.Login, (user: User) => {
            console.log('login' + user);
            this.login(user, socket);
        });

        socket.on(SocketEvent.Disconnect, () => {
            this.logout(socket);
        });

        socket.on(SocketEvent.ChangeUsername, (newUsername: string) => {
            this.changeUsername(newUsername, socket);
        });
    }

    login(user: User, socket: Socket) {
        this.users.set(socket.id, user);
    }

    logout(socket: Socket) {
        this.chat.leaveGameChat(this.users.get(socket.id)?.name || '');
        this.users.delete(socket.id);
    }

    changeUsername(newUsername: string, socket: Socket) {
        const user = this.users.get(socket.id);
        if (user) {
            user.name = newUsername;
            this.users.set(socket.id, user);
        }
    }
}
