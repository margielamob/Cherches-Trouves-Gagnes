import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatMessage } from '@app/interfaces/chat-message';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line no-restricted-imports
import { MessageData } from '../../../../../server/app/interface/message-data';
@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit, AfterViewInit {
    @ViewChild('scroll', { static: true }) private scroll: ElementRef;
    messages: ChatMessage[] = [];
    currentMessage: string;

    constructor(
        private communicationSocket: CommunicationSocketService,
        private gameInformation: GameInformationHandlerService,
        private translate: TranslateService,
    ) {}

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
        this.communicationSocket.on(SocketEvent.EventMessage, (messageData: MessageData) => {
            const { messageKey, params } = messageData;
            this.addMessage(messageKey, 'gameMaster', params);
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

    addMessage(messageKey: string, senderType: string, params?: MessageData['params']) {
        if (senderType === 'gameMaster' && messageKey) {
            const translatedMessage = this.translate.instant(messageKey, params);
            this.messages.push({ content: translatedMessage, type: senderType });
        } else if (senderType !== 'gameMaster') {
            this.messages.push({ content: messageKey, type: senderType });
        }
        this.scrollDown();
    }

    isMulti() {
        return this.gameInformation.isMulti;
    }
}
