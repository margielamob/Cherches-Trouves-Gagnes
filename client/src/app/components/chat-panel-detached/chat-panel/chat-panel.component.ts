import { Component, OnInit } from '@angular/core';
import { DetachedChatManagerService } from '@app/services/chat-service/chat-manager-detached.service';

@Component({
    selector: 'app-detached-chat-panel',
    templateUrl: './chat-panel.component.html',
    styleUrls: ['./chat-panel.component.scss'],
})
export class ChatPanelDetachedComponent implements OnInit {
    showFeed = false;
    showSearch = false;

    constructor(private chatDisplay: DetachedChatManagerService) {}

    ngOnInit(): void {
        this.chatDisplay.isRoomSelected.subscribe((isRoomSelected) => {
            this.showFeed = isRoomSelected;
        });
        this.chatDisplay.isSearchSelected.subscribe((isSearchSelected) => {
            this.showSearch = isSearchSelected;
        });
    }
}
