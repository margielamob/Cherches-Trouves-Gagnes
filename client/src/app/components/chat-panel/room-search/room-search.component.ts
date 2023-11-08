import { Component } from '@angular/core';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';

@Component({
    selector: 'app-room-search',
    templateUrl: './room-search.component.html',
    styleUrls: ['./room-search.component.scss'],
})
export class RoomSearchComponent {
    constructor(private chatDisplay: ChatDisplayService) {}

    goToList() {
        this.chatDisplay.deselectSearch();
    }
}
