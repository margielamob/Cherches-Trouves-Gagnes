import { Component, OnInit } from '@angular/core';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';

@Component({
    selector: 'app-room-create',
    templateUrl: './room-create.component.html',
    styleUrls: ['./room-create.component.scss'],
})
export class RoomCreateComponent implements OnInit {
    isInputEmpty = false;
    isRoomCreated = false;
    errorMessage = 'Room name cannot be empty';
    newRoom = '';
    allRooms: string[] = [];

    constructor(private chatManager: ChatManagerService) {}

    ngOnInit(): void {
        this.chatManager.roomList.subscribe((rooms) => {
            this.allRooms = rooms;
        });
    }

    createRoom() {
        this.isInputEmpty = false;
        this.isRoomCreated = false;
        if (this.newRoom.trim() !== '') {
            this.chatManager.createRoom(this.newRoom.trim());
            this.newRoom = '';
        } else if (this.allRooms.includes(this.newRoom.trim())) {
            this.isRoomCreated = true;
            this.errorMessage = 'Room name already exists';
        } else {
            this.isInputEmpty = true;
            this.errorMessage = 'Room name cannot be empty';
        }
    }
}
