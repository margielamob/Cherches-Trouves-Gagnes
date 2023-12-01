import { ApplicationRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DetachedChatManagerService } from '@app/services/chat-service/chat-manager-detached.service';
import { UserRoom } from '@common/chat';

@Component({
    selector: 'app-detached-room-card',
    templateUrl: './room-card.component.html',
    styleUrls: ['./room-card.component.scss'],
})
export class RoomCardDetachedComponent implements OnInit {
    @Input() room: UserRoom;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    constructor(private chatManager: DetachedChatManagerService, private changeDetectorRef: ApplicationRef) {}

    ngOnInit(): void {
        return;
    }

    leaveRoom() {
        this.chatManager.leaveRoom(this.room.room);
    }

    deleteRoom() {
        this.chatManager.deleteRoom(this.room.room);
    }

    selectRoom(room: string) {
        this.chatManager.selectRoom(room);
        this.changeDetectorRef.tick();
    }
}
