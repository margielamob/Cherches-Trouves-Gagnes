import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DetachedChatManagerService } from '@app/services/chat-service/chat-manager-detached.service';

@Component({
    selector: 'app-detached-room-create',
    templateUrl: './room-create.component.html',
    styleUrls: ['./room-create.component.scss'],
})
export class RoomCreateDetachedComponent implements OnInit {
    isInputEmpty = false;
    isRoomCreated = false;
    errorMessage = 'Room name cannot be empty';
    newRoom = '';
    allRooms: string[] = this.chatManager.allRoomsList.value;

    formControl = new FormControl('');

    constructor(private chatManager: DetachedChatManagerService) {}

    ngOnInit(): void {
        this.chatManager.allRoomsList.subscribe((rooms) => {
            this.allRooms = rooms;
        });
    }

    createRoom() {
        this.isInputEmpty = false;
        this.isRoomCreated = false;
        if (this.allRooms.includes(this.newRoom.trim())) {
            this.formControl.setErrors({ roomError: true });
            this.isRoomCreated = true;
            this.errorMessage = 'Room name already exists';
        } else if (this.newRoom.trim() === '') {
            this.formControl.setErrors({ roomError: true });
            this.isInputEmpty = true;
            this.errorMessage = 'Room name cannot be empty';
        } else {
            this.chatManager.createRoom(this.newRoom.trim());
            this.newRoom = '';
            this.chatManager.deselectSearch();
        }
    }
}
