import { Component, OnInit } from '@angular/core';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';

@Component({
    selector: 'app-chat-button',
    templateUrl: './chat-button.component.html',
    styleUrls: ['./chat-button.component.scss'],
})
export class ChatButtonComponent implements OnInit {
    isChatVisible: boolean = this.chatDisplay.isChatVisible.value;
    constructor(private chatDisplay: ChatDisplayService) {}

    ngOnInit(): void {
        this.chatDisplay.isChatVisible.subscribe((value) => {
            this.isChatVisible = value;
        });
    }

    toggleChat() {
        this.chatDisplay.toggleChat();
        this.chatDisplay.deselectRoom();
    }
}
