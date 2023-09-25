import { Component } from '@angular/core';
import { ChatSocketService } from '@app/services/chat-socket.service';

@Component({
    selector: 'app-main-feed',
    templateUrl: './main-feed.component.html',
    styleUrls: ['./main-feed.component.scss'],
})
export class MainFeedComponent {
    constructor(private chat: ChatSocketService) {}

    public logout() {
        this.chat.leaveChat();
        this.chat.isAuthenticatedObs.next(false);
    }
}
