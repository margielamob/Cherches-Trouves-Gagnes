import { Component, OnInit } from '@angular/core';
import { ChatSocketService } from '@app/services/chat-socket.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    username = '';
    invalid = false;
    empty = false;

    constructor(private socket: SocketClientService, private chat: ChatSocketService) {}

    ngOnInit(): void {
        this.handleEvents();
    }

    public onSubmit() {
        if (this.username.trim() === '') {
            this.empty = true;
        } else {
            this.empty = false;
            this.socket.send(SocketEvent.Authenticate, this.username);
        }
    }

    public handleEvents() {
        this.socket.on(SocketEvent.UserExists, () => {
            this.invalid = true;
        });
        this.socket.on(SocketEvent.UserAuthenticated, () => {
            this.invalid = false;
            this.chat.setUser(this.username);
            this.chat.isAuthenticatedObs.next(true);
        });
    }
}
