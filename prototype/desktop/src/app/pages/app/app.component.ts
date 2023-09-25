import { Component, OnInit } from '@angular/core';
import { ChatSocketService } from '@app/services/chat-socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'angular';

    authenticated = false;

    constructor(private chat: ChatSocketService) {
        this.chat.isAuthenticatedObs.subscribe((isAuthenticated) => {
            this.authenticated = isAuthenticated;
        });
    }

    ngOnInit(): void {
        this.chat.isAuthenticatedObs.next(false);
    }
}
