import { Component, Input } from '@angular/core';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
// import { ipcRenderer } from 'electron';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
    @Input() headerMessage: string;
    @Input() isHomeButtonEnabled: boolean = true;
    @Input() isExitButtonEnabled: boolean = false;
    @Input() isSignOutButtonEnabled: boolean = true;
    @Input() isAvatarEnabled: boolean = true;

    childWindow: Window | null = null;

    constructor(private authService: AuthenticationService, private chatDs: ChatDisplayService, private chatManager: ChatManagerService) {}

    signOut() {
        // Logout function
        this.authService.signOut();
        this.chatDs.reset();
        this.chatManager.detached = false;

        const ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.send('close-chat');
    }
    openWindowTest() {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        const ipcRenderer = window['require']('electron').ipcRenderer;
        ipcRenderer.send('createChatWindow', { test: 'test' });
    }
}
