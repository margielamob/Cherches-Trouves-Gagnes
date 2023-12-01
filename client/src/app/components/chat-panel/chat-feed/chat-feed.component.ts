import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';
// import { ChatMessage } from '@app/interfaces/chat-message';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { ChatMessage } from '@common/chat';

@Component({
    selector: 'app-chat-feed',
    templateUrl: './chat-feed.component.html',
    styleUrls: ['./chat-feed.component.scss'],
})
export class ChatFeedComponent implements AfterViewInit, OnInit, AfterViewChecked {
    @ViewChild('scroll', { static: true }) private scroll: ElementRef;
    messages: ChatMessage[] = [];
    currentMessage: string;
    newMessage = false;
    currentRoom: string;

    constructor(
        // private communicationSocket: CommunicationSocketService,
        private chatManager: ChatManagerService,
        private chatDisplay: ChatDisplayService,
    ) {}

    ngOnInit(): void {
        this.chatManager.messages.subscribe((messages) => {
            this.messages = messages;
            this.newMessage = true;
        });
        // this.chatManager.fetchMessages();
        this.chatManager.activeRoom.subscribe((room) => {
            this.currentRoom = room;
        });
    }

    scrollDown() {
        setTimeout(() => {
            this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
        }, 0);
    }

    ngAfterViewInit() {
        this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
    }

    ngAfterViewChecked(): void {
        if (this.newMessage) {
            this.scrollDown();
            this.newMessage = false;
        }
    }

    sendMessage(): void {
        if (this.currentMessage.trim() !== '') {
            this.chatManager.sendMessage(this.currentMessage.trim());
            this.currentMessage = '';
            this.newMessage = true;
            // this.myInputField.nativeElement.focus();
        }

        // this.communicationSocket.send(SocketEvent.Message, { message: this.currentMessage, roomId: this.chatManager.getCurrentRoom });
        // this.currentMessage = '';
    }

    goToList() {
        this.chatDisplay.deselectRoom();
        this.chatManager.deselectRoom();
    }

    isPersonalMessage(message: ChatMessage): boolean {
        return this.chatManager.isOwnMessage(message);
    }

    isOpponentMessage(message: ChatMessage): boolean {
        return this.chatManager.isOpponentMessage(message);
    }
}
