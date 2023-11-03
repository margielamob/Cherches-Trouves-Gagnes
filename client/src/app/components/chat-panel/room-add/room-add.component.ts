import { Component, OnInit } from '@angular/core';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';

@Component({
    selector: 'app-room-add',
    templateUrl: './room-add.component.html',
    styleUrls: ['./room-add.component.scss'],
})
export class RoomAddComponent implements OnInit {
    unjoinedRooms: string[] = this.chatManager.allRoomsList.value.filter((room: string) => !this.chatManager.userRoomList.value.includes(room));
    selectedRooms: string[] = [];

    constructor(private chatManager: ChatManagerService, private chatDisplay: ChatDisplayService) {}

    ngOnInit(): void {
        this.chatManager.allRoomsList.subscribe((rooms) => {
            this.unjoinedRooms = rooms.filter((room) => !this.chatManager.userRoomList.value.includes(room));
        });
    }

    joinRooms() {
        this.chatManager.joinRooms(this.selectedRooms);
        this.chatDisplay.deselectSearch();
    }
}
