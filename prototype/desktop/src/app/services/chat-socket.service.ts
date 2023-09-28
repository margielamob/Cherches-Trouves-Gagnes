import { Injectable } from '@angular/core';
import { Message } from '@common/prototype/message';
import { User } from '@common/prototype/user';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject } from 'rxjs';
import { ClientEvent } from './Events/client-events';
import { SocketClientService } from './socket-client.service';
@Injectable({
    providedIn: 'root',
})
export class ChatSocketService {
    private messagesArray: Message[] = [];
    private user: User = { username: '' };
    isAuthenticated = false;

    messagesObs: BehaviorSubject<Message[]> = new BehaviorSubject(this.messagesArray);
    userNameObs: BehaviorSubject<User> = new BehaviorSubject(this.user);
    isAuthenticatedObs: BehaviorSubject<boolean> = new BehaviorSubject(this.isAuthenticated);

    constructor(private socket: SocketClientService) {
        this.socket.connect();
        this.handleEvents();
    }

    public get messages(): Message[] {
        return this.messagesArray;
    }

    public setUser(user: string) {
        this.userNameObs.next({ username: user });
    }

    public joinChannel(user: User) {
        this.socket.send<User>(ClientEvent.JOIN_CHAT, user);
    }

    public leaveChat() {
        this.socket.send<string>(SocketEvent.DisconnectFromChat, this.user.username);
        this.messagesArray = [];
        this.messagesObs.next(this.messagesArray);
    }

    public sendMessage(message: Message) {
        this.socket.send<Message>(SocketEvent.PrototypeMessage, message);
    }

    public fetchMessages() {
        this.socket.send<string>(SocketEvent.FetchMessages, this.user.username);
    }

    public handleEvents() {
        this.socket.on(SocketEvent.NewMessage, (message: Message) => {
            this.messagesArray.push(message);
            this.messagesObs.next(this.messagesArray);
        });
        this.socket.on(SocketEvent.ServeMessages, (messages: Message[]) => {
            this.messagesObs.next(messages);
        });
    }
}
