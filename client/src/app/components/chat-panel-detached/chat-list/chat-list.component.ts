import { ApplicationRef, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DetachedChatManagerService } from '@app/services/chat-service/chat-manager-detached.service';
import { UserRoom } from '@common/chat';

@Component({
    selector: 'app-detached-chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.scss'],
})
export class ChatListDetachedComponent implements OnInit {
    rooms: UserRoom[] = this.chatManager.userRoomList.value;

    constructor(
        private chatManager: DetachedChatManagerService,
        private changeDetectorRef: ChangeDetectorRef,
        private applicationRef: ApplicationRef,
    ) {}

    ngOnInit(): void {
        this.chatManager.userRoomList.subscribe((rooms) => {
            this.rooms = rooms;
            // update view
            this.changeDetectorRef.detectChanges();
        });
    }

    // selectRoom(room: string) {
    //     this.chatManager.selectRoom(room);
    //     this.chatDisplay.selectRoom();
    // }

    goToSearch() {
        this.chatManager.selectSearch();
        this.applicationRef.tick();
    }
    attach() {
        this.chatManager.attach();
        this.applicationRef.tick();
    }
}
