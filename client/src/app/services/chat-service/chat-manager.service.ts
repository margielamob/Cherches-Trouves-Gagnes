import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatManagerService {
    activeRoom: BehaviorSubject<string> = new BehaviorSubject<string>('all');
    roomList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    allRoomsList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    messages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    constructor(private socket: CommunicationSocketService) {
        this.addListeners();
        this.fetchUserRooms();
    }

    selectRoom(room: string) {
        this.activeRoom.next(room);
        this.fetchMessages();
    }

    sendMessage(message: string) {
        this.socket.send(SocketEvent.Message, { message, roomId: this.activeRoom.value });
    }

    addMessage(message: string) {
        this.messages.next([...this.messages.value, message]);
    }

    addListeners() {
        this.socket.on(SocketEvent.Message, (message: { message: string; roomId: string }) => {
            if (message.roomId === this.activeRoom.value) {
                this.addMessage(message.message);
            }
        });
        this.socket.on(SocketEvent.EventMessage, (message: string) => {
            this.addMessage(message);
        });
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
}
