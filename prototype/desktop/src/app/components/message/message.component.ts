import { Component, Input, OnInit } from '@angular/core';
import { ChatSocketService } from '@app/services/chat-socket.service';
import { Message } from '@common/prototype/message';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
    @Input() message: Message;
    messageClass: string;

    constructor(private chat: ChatSocketService) {}

    ngOnInit() {
        this.messageClass = this.chat.userNameObs.value.username == this.message.user.username ? 'message-user' : 'message-other';
    }
}
