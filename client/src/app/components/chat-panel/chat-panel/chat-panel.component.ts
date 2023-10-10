import { Component, OnInit } from '@angular/core';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';

@Component({
    selector: 'app-chat-panel',
    templateUrl: './chat-panel.component.html',
    styleUrls: ['./chat-panel.component.scss'],
})
export class ChatPanelComponent implements OnInit {
    showFeed = false;
    showSearch = false;

    constructor(private chatDisplay: ChatDisplayService) {}

    ngOnInit(): void {
        this.chatDisplay.isRoomSelected.subscribe((isRoomSelected) => {
            this.showFeed = isRoomSelected;
        });
        this.chatDisplay.isSearchSelected.subscribe((isSearchSelected) => {
            this.showSearch = isSearchSelected;
        });
    }
}
