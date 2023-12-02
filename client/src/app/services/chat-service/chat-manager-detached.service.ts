/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { LanguageService } from '@app/services/language-service/languag.service';
import { ThemeService } from '@app/services/theme-service/theme.service';
import { ChatMessage, UserRoom } from '@common/chat';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class DetachedChatManagerService {
    activeRoom: BehaviorSubject<string> = new BehaviorSubject<string>('');
    userRoomList: BehaviorSubject<UserRoom[]> = new BehaviorSubject<UserRoom[]>([]);
    allRoomsList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    unreadMessages: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    // activeUser: string;

    messages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
    user: string = '';

    detached: boolean = false;

    isRoomSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isSearchSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private languageService: LanguageService, private themeService: ThemeService) {
        this.userRoomList.subscribe((rooms) => {
            this.unreadMessages.next(rooms.filter((room) => !room.read).length);
        });
        this.addListeners();
    }

    selectSearch() {
        this.isSearchSelected.next(true);
    }

    deselectSearch() {
        this.isSearchSelected.next(false);
    }

    selectRoom(room: string) {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('selectRoom', { roomName: room });
        this.isRoomSelected.next(true);
    }

    deselectRoom() {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('deselectRoom');
        this.isRoomSelected.next(false);
    }

    sendMessage(message: string) {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('sendMessage', { message });
    }

    addMessage(message: ChatMessage) {
        this.messages.next([...this.messages.value, message]);
    }

    addListeners() {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.on(
            'sync-detached',
            (_event: any, args: { allRoomsList: string[]; userRoomList: UserRoom[]; messages: ChatMessage[]; activeRoom: string; user: string }) => {
                this.allRoomsList.next(args.allRoomsList);
                this.userRoomList.next(args.userRoomList);
                this.messages.next(args.messages);
                this.activeRoom.next(args.activeRoom);
                this.user = args.user;
            },
        );
        ipcRenderer.on(
            'chatData',
            (
                _event: any,
                data: {
                    user: string;
                    allRoomsList: string[];
                    userRoomList: UserRoom[];
                    messages: ChatMessage[];
                    activeRoom: string;
                    isRoomSelected: boolean;
                    isSearchSelected: boolean;
                    language: string;
                    theme: string;
                },
            ) => {
                console.log(data.userRoomList);
                this.user = data.user;
                this.allRoomsList.next(data.allRoomsList);
                this.userRoomList.next(data.userRoomList);
                this.messages.next(data.messages);
                this.activeRoom.next(data.activeRoom);
                this.isRoomSelected.next(data.isRoomSelected);
                this.isSearchSelected.next(data.isSearchSelected);
                this.languageService.setAppLanguage(data.language);
                this.themeService.setAppTheme(data.theme);
            },
        );

        ipcRenderer.on('language', (_event: any, language: string) => {
            this.languageService.setAppLanguage(language);
        });

        ipcRenderer.on('theme', (_event: any, theme: string) => {
            this.themeService.setAppTheme(theme);
        });
    }

    initDetachedChat(user: string) {
        this.user = user;
    }

    getCurrentRoom() {
        return this.activeRoom.value;
    }

    fetchUserRooms() {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('fetchUserRooms');
    }

    fetchAllRooms() {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('fetchAllRooms');
    }

    fetchMessages() {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('fetchMessages');
    }

    createRoom(roomName: string) {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('createRoom', { roomName });
    }

    joinRooms(roomNames: string[]) {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('joinRooms', { roomNames });
    }

    isOwnMessage(message: ChatMessage): boolean {
        return message.user === this.user;
    }

    isOpponentMessage(message: ChatMessage): boolean {
        return message.user !== this.user;
    }

    leaveRoom(roomName: string) {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('leaveRoom', { roomName });
    }

    deleteRoom(roomName: string) {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('deleteRoom', { roomName });
    }

    // leaveGameChat() {
    //     if (this.activeRoom.value.startsWith('Game')) {
    //         this.display.deselectRoom();
    //     }
    //     const gameChat = this.userRoomList.value.find((room) => room.room.startsWith('Game'));
    //     this.socket.send(SocketEvent.LeaveRoom, { roomName: gameChat, userName: this.userService.activeUser.displayName });
    // }

    // detach() {
    //     const ipcRenderer = window.require('electron').ipcRenderer;
    //     ipcRenderer.send('detach', { user: this.userService.activeUser.displayName });
    //     this.sync();
    // }

    attach() {
        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('attach', { isRoomSelected: this.isRoomSelected.value, isSearchSelected: this.isSearchSelected.value });
    }

    sync() {
        if (this.detached) {
            const ipcRenderer = window.require('electron').ipcRenderer;
            ipcRenderer.send('sync-attached', {
                allRoomsList: this.allRoomsList.value,
                userRoomList: this.userRoomList.value,
                messages: this.messages.value,
                activeRoom: this.activeRoom.value,
            });
        }
    }
}
