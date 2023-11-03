import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';

@Component({
    selector: 'app-room-card',
    templateUrl: './room-card.component.html',
    styleUrls: ['./room-card.component.scss'],
})
export class RoomCardComponent implements OnInit {
    @Input() room: string;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    constructor(private chatManager: ChatManagerService, private chatDisplay: ChatDisplayService) {}

    ngOnInit(): void {
        return;
    }

    leaveRoom() {
        this.chatManager.leaveRoom(this.room);
    }

    deleteRoom() {
        this.chatManager.deleteRoom(this.room);
    }

    selectRoom(room: string) {
        this.chatManager.selectRoom(room);
        this.chatDisplay.selectRoom();
    }
}
