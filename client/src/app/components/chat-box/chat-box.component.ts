import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatMessage } from '@app/interfaces/chat-message';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';
@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit, AfterViewInit {
    @ViewChild('scroll', { static: true }) private scroll: ElementRef;
    messages: ChatMessage[] = [];
    currentMessage: string;

    constructor(private communicationSocket: CommunicationSocketService, private gameInformation: GameInformationHandlerService) {}

    @HostListener('window:keyup', ['$event'])
    onDialogClick(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.onClickSend();
        }
    }

    scrollDown() {
        setTimeout(() => {
            this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
        }, 0);
    }

    ngOnInit(): void {
        this.communicationSocket.on(SocketEvent.Message, (message: string) => {
            this.addMessage(message, 'opponent');
        });
        this.communicationSocket.on(SocketEvent.EventMessage, (message: string) => {
            this.addMessage(message, 'gameMaster');
        });
    }

    ngAfterViewInit() {
        this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
    }

    isOpponentMessage(message: ChatMessage) {
        return message.type === 'opponent';
    }

    isPersonalMessage(message: ChatMessage) {
        return message.type === 'personal';
    }

    isEventMessage(message: ChatMessage) {
        return message.type === 'gameMaster';
    }

    onClickSend(): void {
        this.addMessage(this.currentMessage, 'personal');
        this.communicationSocket.send(SocketEvent.Message, { message: this.currentMessage, roomId: this.gameInformation.roomId });
        this.currentMessage = '';
    }

    addMessage(message: string, senderType: string) {
        if (message.trim().length !== 0) {
            this.messages.push({ content: message, type: senderType });
        }
        this.scrollDown();
    }

    isMulti() {
        return this.gameInformation.isMulti;
    }
}
