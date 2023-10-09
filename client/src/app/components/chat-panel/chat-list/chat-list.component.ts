import { Component, OnInit } from '@angular/core';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
    rooms: string[] = [];

    constructor(private chatManager: ChatManagerService) {}

    ngOnInit(): void {
        this.chatManager.roomList.subscribe((rooms) => {
            this.rooms = rooms;
        });
    }

    selectRoom(room: string) {
        this.chatManager.selectRoom(room);
    }
}
