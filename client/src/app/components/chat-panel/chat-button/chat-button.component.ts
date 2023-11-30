import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ChatDisplayService } from '@app/services/chat-service/chat-display.service';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';

@Component({
    selector: 'app-chat-button',
    templateUrl: './chat-button.component.html',
    styleUrls: ['./chat-button.component.scss'],
})
export class ChatButtonComponent implements OnInit, AfterViewInit {
    @ViewChild('overlay', { static: false, read: ElementRef }) overlay: ElementRef<HTMLElement> | undefined;
    @ViewChild('button', { static: false, read: ElementRef }) button: ElementRef<HTMLElement> | undefined;

    isChatVisible: boolean = this.chatDisplay.isChatVisible.value;
    constructor(
        private chatDisplay: ChatDisplayService,
        private renderer: Renderer2,
        private chatManager: ChatManagerService, // private applicationRef: ApplicationRef,
    ) {
        console.log('chat button constructor');
    }
    ngAfterViewInit(): void {
        this.addClickOutsideListener();
    }
    ngOnInit(): void {
        this.chatDisplay.isChatVisible.subscribe((value) => {
            this.isChatVisible = value;
            // this.applicationRef.tick();
        });
    }

    toggleChat() {
        console.log('toggle chat');
        if (this.chatManager.detached) {
            const ipcRenderer = window.require('electron').ipcRenderer;
            ipcRenderer.send('focus-chat');
            return;
        }
        // this.chatDisplay.toggleChat();
        // if (!this.chatDisplay.isChatVisible.value) {
        //     console.log('1');
        //     this.chatDisplay.isChatVisible.next(true);
        // } else {
        //     console.log('2');
        //     this.chatDisplay.isChatVisible.next(false);
        // }
        this.chatDisplay.toggleChat();
        this.chatDisplay.deselectRoom();
        // this.applicationRef.tick();
    }

    private addClickOutsideListener(): void {
        this.renderer.listen('document', 'click', (event: MouseEvent) => {
            if (this.button && this.overlay && this.isChatVisible) {
                console.log(this.overlay.nativeElement);
                const buttonBounds = this.button.nativeElement.getBoundingClientRect();
                const overlayBounds = this.overlay.nativeElement.getBoundingClientRect();

                const isClickOutsideButton = !(
                    event.clientX >= buttonBounds.left &&
                    event.clientX <= buttonBounds.right &&
                    event.clientY >= buttonBounds.top &&
                    event.clientY <= buttonBounds.bottom
                );

                const isClickOutsideOverlay = !(
                    event.clientX >= overlayBounds.left &&
                    event.clientX <= overlayBounds.right &&
                    event.clientY >= overlayBounds.top &&
                    event.clientY <= overlayBounds.bottom
                );

                if (isClickOutsideButton) {
                    console.log('click outside button');
                }

                if (isClickOutsideButton && isClickOutsideOverlay) {
                    console.log('click outside');
                    this.chatDisplay.hideChat();
                }
            }
        });
    }
}
