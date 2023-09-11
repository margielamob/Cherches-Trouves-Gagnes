/* eslint-disable no-console */
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { ChatMessage } from '@common/chat-message';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-prototype-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class PrototypeChatBoxComponent implements OnInit, AfterViewInit {
    @ViewChild('myinput') myInputField: ElementRef;

    messages: ChatMessage[] = [];
    currentRoom: string = 'allChat';
    inputMessage: ChatMessage = { userName: 'Test', body: '', room: this.currentRoom };

    constructor(private communicationSocketService: CommunicationSocketService) {}

    ngOnInit(): void {
        this.configureChatSocket();
    }

    ngAfterViewInit() {
        this.myInputField.nativeElement.focus();
    }

    blockEventPropagation(event: KeyboardEvent) {
        event.stopPropagation();
    }

    sendMessage() {
        console.log(this.inputMessage);
        this.communicationSocketService.send(SocketEvent.ChatMessage, { message: this.inputMessage });
        this.inputMessage.body = '';
    }

    private configureChatSocket() {
        this.communicationSocketService.on(SocketEvent.ChatMessage, (message: ChatMessage) => {
            console.log(message);
            if (message.room === this.currentRoom) {
                this.messages.push(message);
            } else {
                // notification
            }
        });
    }
}
