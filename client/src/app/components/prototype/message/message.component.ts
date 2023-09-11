import { Component, Input } from '@angular/core';
import { ChatMessage } from '@common/chat-message';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
    @Input() message: ChatMessage;

    isOpponentMessage(message: ChatMessage) {
        console.log('jasdgh');
        return message.userName === 'Test';
    }

    isPersonalMessage(message: ChatMessage) {
        return false;
    }

    isEventMessage(message: ChatMessage) {
        return false;
    }
}
