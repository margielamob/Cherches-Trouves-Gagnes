import { Component, OnInit } from '@angular/core';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';

@Component({
    selector: 'app-chat-panel',
    templateUrl: './chat-panel.component.html',
    styleUrls: ['./chat-panel.component.scss'],
})
export class ChatPanelComponent implements OnInit {
    showFeed = false;

    constructor(private chatManager: ChatManagerService) {}

    ngOnInit(): void {
        this.chatManager.isRoomSelected.subscribe((isRoomSelected) => {
            this.showFeed = isRoomSelected;
        });
    }
}
