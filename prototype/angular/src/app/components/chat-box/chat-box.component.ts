import { Component, OnInit } from '@angular/core';
import { Message } from '@common/prototype/message';
import { ChatSocketService } from 'src/app/services/chat-socket.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    public chatMessages: Message[] = [];
    message = '';

    constructor(private chat: ChatSocketService) {
        this.chatMessages = chat.messages;
    }

    ngOnInit(): void {
        this.chat.setUser;
        this.chat.messagesObs.subscribe((messages) => {
            this.chatMessages = messages;
        });
    }

    public sendMessage(text: string) {
        if (text.trim() !== '') {
            const message = {
                user: this.chat.userNameObs.getValue(),
                message: text.trim(),
            };
            this.chat.sendMessage(message);
            this.message = '';
        }
    }
}
