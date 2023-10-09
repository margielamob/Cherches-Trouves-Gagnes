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

    messages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    isRoomSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private socket: CommunicationSocketService) {
        this.addListeners();
        this.fetchRooms();
    }

    selectRoom(room: string) {
        this.activeRoom.next(room);
        this.fetchMessages();
        this.isRoomSelected.next(true);
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
                console.log(message.message);
                this.addMessage(message.message);
            }
        });
        this.socket.on(SocketEvent.EventMessage, (message: string) => {
            this.addMessage(message);
        });
        this.socket.on(SocketEvent.GetRooms, (rooms: string[]) => {
            this.roomList.next(rooms);
        });
    }

    getCurrentRoom() {
        return this.activeRoom.value;
    }

    fetchRooms() {
        this.socket.send(SocketEvent.GetRooms);
    }

    fetchMessages() {
        this.socket.send(SocketEvent.GetMessages, { roomId: this.activeRoom.value });
    }
}
