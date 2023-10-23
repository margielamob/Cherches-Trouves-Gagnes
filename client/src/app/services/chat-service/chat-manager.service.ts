import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { UserService } from '@app/services/user-service/user.service';
import { ChatMessage } from '@common/chat';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ChatManagerService {
    activeRoom: BehaviorSubject<string> = new BehaviorSubject<string>('all');
    roomList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    allRoomsList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    activeUser: string;

    messages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

    constructor(private socket: CommunicationSocketService, private userService: UserService) {
        this.addListeners();
        this.fetchUserRooms();
        this.fetchRooms();
        this.userService.getCurrentUser().subscribe((user) => {
            this.activeUser = user?.displayName || '';
        });
    }
    selectRoom(room: string) {
        this.activeRoom.next(room);
        this.fetchMessages();
    }

    sendMessage(message: string) {
        const newMessage: ChatMessage = { message, user: this.activeUser, room: this.activeRoom.value };
        console.log(newMessage);
        this.socket.send(SocketEvent.Message, { message: newMessage });
    }

    addMessage(message: ChatMessage) {
        this.messages.next([...this.messages.value, message]);
    }

    addListeners() {
        this.socket.on(SocketEvent.Message, (message: ChatMessage) => {
            if (message.room === this.activeRoom.value) {
                this.addMessage(message);
            }
        });
        // this.socket.on(SocketEvent.EventMessage, (message: ChatMessage) => {
        //     this.addMessage(message);
        // });
        this.socket.on(SocketEvent.GetUserRooms, (rooms: string[]) => {
            this.roomList.next(rooms);
        });
        this.socket.on(SocketEvent.GetRooms, (rooms: string[]) => {
            this.allRoomsList.next(rooms);
        });
        this.socket.on(SocketEvent.RoomCreated, (rooms: { all: string[]; user: string[] }) => {
            this.roomList.next(rooms.user);
            this.allRoomsList.next(rooms.all);
        });
        this.socket.on(SocketEvent.NewRoom, (rooms: string[]) => {
            this.allRoomsList.next(rooms);
        });
    }

    getCurrentRoom() {
        return this.activeRoom.value;
    }

    fetchUserRooms() {
        this.socket.send(SocketEvent.GetUserRooms);
    }

    fetchRooms() {
        this.socket.send(SocketEvent.GetRooms);
    }

    fetchMessages() {
        this.socket.send(SocketEvent.GetMessages, { roomId: this.activeRoom.value });
    }

    createRoom(roomName: string) {
        this.socket.send(SocketEvent.CreateRoom, { roomName });
    }

    joinRooms(roomNames: string[]) {
        this.socket.send(SocketEvent.JoinRooms, { roomNames });
    }

    isOwnMessage(message: ChatMessage): boolean {
        return message.user === this.activeUser;
    }

    isOpponentMessage(message: ChatMessage): boolean {
        return message.user !== this.activeUser;
    }
}
