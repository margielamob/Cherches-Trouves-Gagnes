/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { UserData } from '@app/interfaces/user';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { LanguageService } from '@app/services/language-service/languag.service';
import { ThemeService } from '@app/services/theme-service/theme.service';
import { UserService } from '@app/services/user-service/user.service';
import { ChatMessage, UserRoom } from '@common/chat';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatDisplayService } from './chat-display.service';
@Injectable({
    providedIn: 'root',
})
export class ChatManagerService {
    activeRoom: BehaviorSubject<string> = new BehaviorSubject<string>('');
    userRoomList: BehaviorSubject<UserRoom[]> = new BehaviorSubject<UserRoom[]>([]);
    allRoomsList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    unreadMessages: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    // activeUser: string;

    messages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
    user$: Observable<UserData | undefined>;

    detached: boolean = false;

    constructor(
        private socket: CommunicationSocketService,
        private userService: UserService,
        private display: ChatDisplayService,
        private languageService: LanguageService,
        private themeService: ThemeService,
    ) {
        // this.addListeners();
        // this.fetchUserRooms();
        // this.fetchAllRooms();
        // this.initChat();
        this.addListeners();
        this.addProcessListeners();
        this.userRoomList.subscribe((rooms) => {
            this.unreadMessages.next(rooms.filter((room) => !room.read).length);
            this.sync();
        });
        this.allRoomsList.subscribe(() => {
            this.sync();
        });
        this.messages.subscribe(() => {
            // console.log('messages changed');
            this.sync();
        });
        this.activeRoom.subscribe(() => {
            this.sync();
        });
    }
    selectRoom(room: string) {
        this.activeRoom.next(room);
        this.fetchMessages();

        this.socket.send(SocketEvent.ReadMessages, {
            roomName: room,
            userName: this.userService.activeUser.displayName,
        });

        this.userRoomList.next(
            this.userRoomList.value.map((userRoom) => {
                if (userRoom.room === room) {
                    return { room: userRoom.room, read: true, lastMessage: userRoom.lastMessage };
                }
                return userRoom;
            }),
        );
        this.display.selectRoom();
    }

    deselectRoom() {
        this.activeRoom.next('');
    }

    sendMessage(message: string) {
        // console.log('sending message');
        const newMessage: ChatMessage = { message, user: this.userService.activeUser.displayName, room: this.activeRoom.value };
        this.socket.send(SocketEvent.Message, { message: newMessage });
    }

    addMessage(message: ChatMessage) {
        this.messages.next([...this.messages.value, message]);
    }

    addListeners() {
        // this.socket.on(SocketEvent.Message, (message: ChatMessage) => {
        //     console.log('message received');
        //     if (message.room === this.activeRoom.value) {
        //         this.addMessage(message);
        //     }
        // });
        this.socket.on(SocketEvent.Message, (message: ChatMessage) => {
            if (message.room === this.activeRoom.value && this.display.isRoomSelected.value) {
                // AND CHAT DISPLAY IS ACTIVE
                const newMessages: ChatMessage[] = [...this.messages.value, message];
                this.messages.next(newMessages);

                this.socket.send(SocketEvent.ReadMessages, {
                    roomName: message.room,
                    userName: this.userService.activeUser.displayName,
                });

                const newUserRooms: UserRoom[] = this.userRoomList.value;
                newUserRooms.forEach((room) => {
                    if (room.room === message.room) {
                        room.read = true;
                        room.lastMessage = message;
                    }
                });
                this.userRoomList.next(newUserRooms);
            } else {
                const newUserRooms: UserRoom[] = this.userRoomList.value;
                newUserRooms.forEach((room) => {
                    if (room.room === message.room) {
                        room.read = false;
                        room.lastMessage = message;

                        this.socket.send(SocketEvent.UnreadMessage, {
                            roomName: message.room,
                            userName: this.userService.activeUser.displayName,
                        });
                    }
                });
                this.userRoomList.next(newUserRooms);
            }
            this.sync();
        });
        this.socket.on(SocketEvent.UpdateAllRooms, (rooms: string[]) => {
            this.allRoomsList.next(rooms);
            this.sync();
        });
        this.socket.on(SocketEvent.UpdateUserRooms, (rooms: UserRoom[]) => {
            this.userRoomList.next(rooms);
            this.sync();
            // this.userRoomList.next(rooms.map((room) => room.room));
        });
        this.socket.on(SocketEvent.RoomDeleted, () => {
            this.fetchUserRooms();
            this.fetchAllRooms();
            this.sync();
        });
        this.socket.on(SocketEvent.GetMessages, (messages: ChatMessage[]) => {
            this.messages.next(messages);
            this.sync();
        });
    }

    initChat(userName: string) {
        this.socket.send(SocketEvent.InitChat, { userName });
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
        this.socket.send(SocketEvent.CreateRoom, { roomName, userName: this.userService.activeUser.displayName });
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
        const gameChat = this.userRoomList.value.find((room) => room.room.startsWith('Game'))?.room;
        this.socket.send(SocketEvent.LeaveRoom, { roomName: gameChat, userName: this.userService.activeUser.displayName });
    }

    detach() {
        this.detached = true;
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('detach', {
            user: this.userService.activeUser.displayName,
            allRoomsList: this.allRoomsList.value,
            userRoomList: this.userRoomList.value,
            messages: this.messages.value,
            activeRoom: this.activeRoom.value,
            isRoomSelected: this.display.isRoomSelected.value,
            isSearchSelected: this.display.isSearchSelected.value,
            language: this.languageService.getCurrentLanguage(),
            theme: this.themeService.getAppTheme(),
        });
        this.sync();
    }

    sync() {
        if (this.detached) {
            const data = {
                allRoomsList: this.allRoomsList.value,
                userRoomList: this.userRoomList.value,
                messages: this.messages.value,
                activeRoom: this.activeRoom.value,
                user: this.userService.activeUser.displayName,
            };
            const ipcRenderer = window.require('electron').ipcRenderer;
            ipcRenderer.send('sync-detached', data);
        }
    }

    addProcessListeners() {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.on('sync-main', (_event: any, args: { allRoomsList: string[]; userRoomList: UserRoom[]; messages: ChatMessage[] }) => {
            this.allRoomsList.next(args.allRoomsList);
            this.userRoomList.next(args.userRoomList);
            this.messages.next(args.messages);
        });
        ipcRenderer.on('detach', () => {
            this.detached = true;
        });
        ipcRenderer.on('attach', (args: { isRoomSelected: boolean; isSearchSelected: boolean }) => {
            this.detached = false;
            this.display.isRoomSelected.next(args.isRoomSelected);
            this.display.isSearchSelected.next(args.isSearchSelected);
            this.display.toggleChat();
        });
        ipcRenderer.on('selectRoom', (_event: any, args: { roomName: string }) => {
            this.selectRoom(args.roomName);
            this.sync();
        });
        ipcRenderer.on('deselectRoom', () => {
            this.deselectRoom();
            this.sync();
        });
        ipcRenderer.on('sendMessage', (_event: any, args: { message: string }) => {
            this.sendMessage(args.message);
        });
        ipcRenderer.on('fetchUserRooms', () => {
            this.fetchUserRooms();
        });
        ipcRenderer.on('fetchAllRooms', () => {
            this.fetchAllRooms();
        });
        ipcRenderer.on('fetchMessages', () => {
            this.fetchMessages();
        });
        ipcRenderer.on('createRoom', (_event: any, args: { roomName: string }) => {
            this.createRoom(args.roomName);
        });
        ipcRenderer.on('joinRooms', (_event: any, args: { roomNames: string[] }) => {
            this.joinRooms(args.roomNames);
        });
        ipcRenderer.on('leaveRoom', (_event: any, args: { roomName: string }) => {
            this.leaveRoom(args.roomName);
        });
        ipcRenderer.on('deleteRoom', (_event: any, args: { roomName: string }) => {
            this.deleteRoom(args.roomName);
        });
    }

    updateMessagesUsername(oldName: string, newName: string) {
        if (this.messages.value.length === 0) {
            return;
        }
        const newMessages = this.messages.value.map((message) => {
            if (message.user === oldName) {
                return { ...message, user: newName };
            }
            return message;
        });
        this.messages.next(newMessages);
        this.socket.send(SocketEvent.UpdateMessagesUsername, { oldName, newName });
    }

    updateDetachedLanguage(language: string) {
        if (!this.detached) {
            return;
        }
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('language', { language });
    }

    updateDetachedTheme(theme: string) {
        if (!this.detached) {
            return;
        }
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('theme', { theme });
    }
}
