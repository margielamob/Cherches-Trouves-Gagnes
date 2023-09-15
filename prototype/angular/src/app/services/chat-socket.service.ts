import { Injectable } from '@angular/core';
import { Message } from '../interfaces/message';
import { User } from '../interfaces/user';
import { ClientEvent } from './Events/client-events';
import { SocketClientService } from './socket-client.service';
@Injectable({
    providedIn: 'root',
})
export class ChatSocketService {
    private user: User = {} as User;

    private messagesArray: Message[] = [];

    constructor(private socket: SocketClientService) {
        this.socket.connect();
    }

    public get messages(): Message[] {
        return this.messages;
    }

    public setUser(user: User) {
        this.user = user;
    }

    public joinChannel(user: User) {
        this.socket.send<User>(ClientEvent.JOIN_CHAT, user);
    }

    public leaveChannel(user: User) {
        this.socket.send<User>(ClientEvent.LEAVE_CHAT, user);
    }

    public sendMessage(message: Message) {
        this.socket.send<Message>(ClientEvent.CHAT_MESSAGE, message);
    }

    public handleEvents() {}
}
