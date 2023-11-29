import { Component, OnInit } from '@angular/core';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { UserRoom } from '@common/chat';

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
    rooms: UserRoom[] = this.chatManager.userRoomList.value;

    constructor(private chatManager: ChatManagerService, private chatDisplay: ChatDisplayService) {}

    ngOnInit(): void {
        this.chatManager.userRoomList.subscribe((rooms) => {
            this.rooms = rooms;
        });
    }

    // selectRoom(room: string) {
    //     this.chatManager.selectRoom(room);
    //     this.chatDisplay.selectRoom();
    // }

    goToSearch() {
        this.chatDisplay.selectSearch();
    }

    detach() {
        this.chatManager.detach();
        this.chatDisplay.toggleChat();
    }
}
