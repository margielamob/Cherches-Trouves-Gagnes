import { ApplicationRef, Component } from '@angular/core';
import { DetachedChatManagerService } from '@app/services/chat-service/chat-manager-detached.service';

@Component({
    selector: 'app-detached-room-search',
    templateUrl: './room-search.component.html',
    styleUrls: ['./room-search.component.scss'],
})
export class RoomSearchDetachedComponent {
    constructor(private chatDisplay: DetachedChatManagerService, private applicationRef: ApplicationRef) {}

    goToList() {
        this.chatDisplay.deselectSearch();
        this.applicationRef.tick();
    }
}
