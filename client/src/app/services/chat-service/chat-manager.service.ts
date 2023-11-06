import { Injectable } from '@angular/core';
import { UserData } from '@app/interfaces/user';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { UserService } from '@app/services/user-service/user.service';
import { ChatMessage } from '@common/chat';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatDisplayService } from './chat-display.service';
@Injectable({
    providedIn: 'root',
})
export class ChatManagerService {
    activeRoom: BehaviorSubject<string> = new BehaviorSubject<string>('all');
    userRoomList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    allRoomsList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    activeUser: string;

    messages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
    user$: Observable<UserData | undefined>;

    constructor(private socket: CommunicationSocketService, private userService: UserService, private display: ChatDisplayService) {
        // this.addListeners();
        // this.fetchUserRooms();
        // this.fetchAllRooms();
        // this.initChat();
    }
    selectRoom(room: string) {
        this.activeRoom.next(room);
        this.fetchMessages();
    }

    sendMessage(message: string) {
        const newMessage: ChatMessage = { message, user: this.userService.activeUser.displayName, room: this.activeRoom.value };
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

        this.socket.on(SocketEvent.UpdateAllRooms, (rooms: string[]) => {
            console.log('all rooms : ' + rooms);
            this.allRoomsList.next(rooms);
        });
        this.socket.on(SocketEvent.UpdateUserRooms, (rooms: string[]) => {
            console.log('update user rooms : ' + rooms);
            this.userRoomList.next(rooms);
        });
        this.socket.on(SocketEvent.RoomCreated, (rooms: { all: string[]; user: string[] }) => {
            this.userRoomList.next(rooms.user);
            this.allRoomsList.next(rooms.all);
        });
        this.socket.on(SocketEvent.RoomDeleted, () => {
            console.log('room deleted');
            this.fetchUserRooms();
            this.fetchAllRooms();
        });
        this.socket.on(SocketEvent.GetMessages, (messages: ChatMessage[]) => {
            this.messages.next(messages);
        });
    }

    initChat() {
        this.addListeners();
        this.socket.send(SocketEvent.InitChat, { userName: this.userService.activeUser.displayName });
    }
    getCurrentRoom() {
        return this.activeRoom.value;
    }

    fetchUserRooms() {
        this.socket.send(SocketEvent.GetUserRooms, { userName: this.userService.activeUser.displayName });
    }

    fetchAllRooms() {
        this.socket.send(SocketEvent.GetAllRooms);
    }

    fetchMessages() {
        this.socket.send(SocketEvent.GetMessages, { roomId: this.activeRoom.value });
    }

    createRoom(roomName: string) {
        this.socket.send(SocketEvent.CreateRoom, { roomName });
    }

    joinRooms(roomNames: string[]) {
        this.socket.send(SocketEvent.JoinRooms, { roomNames, userName: this.userService.activeUser.displayName });
    }

    isOwnMessage(message: ChatMessage): boolean {
        return message.user === this.userService.activeUser.displayName;
    }

    isOpponentMessage(message: ChatMessage): boolean {
        return message.user !== this.userService.activeUser.displayName;
    }

    leaveRoom(roomName: string) {
        this.socket.send(SocketEvent.LeaveRoom, { roomName, userName: this.userService.activeUser.displayName });
    }

    deleteRoom(roomName: string) {
        this.socket.send(SocketEvent.DeleteRoom, { roomName });
    }

    leaveGameChat() {
        if (this.activeRoom.value.startsWith('Game')) {
            this.display.deselectRoom();
        }
        const gameChat = this.userRoomList.value.find((room) => room.startsWith('Game'));
        this.socket.send(SocketEvent.LeaveRoom, { roomName: gameChat, userName: this.userService.activeUser.displayName });
    }
}
