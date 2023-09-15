import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { ChatSocketService } from 'src/app/services/chat-socket.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    @Input() user: User = { username: 'Skander' };
    public chatMessages = [];

    constructor(private chat: ChatSocketService) {}

    ngOnInit(): void {
        this.chat.setUser;
    }

    public sendMessage(text: string) {
        const message = {
            user: this.user,
            message: text,
            date: new Date(),
        };
        this.chat.sendMessage(message);
    }
}
