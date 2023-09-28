import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Message } from '@common/prototype/message';
import { ChatSocketService } from 'src/app/services/chat-socket.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit, AfterViewInit {
    @ViewChild('myinput') myInputField: ElementRef;
    @ViewChildren('message') messagesInDom: QueryList<ElementRef>;

    public chatMessages: Message[] = [];
    message = '';
    currentUser = '';
    newMessage = false;

    constructor(private chat: ChatSocketService) {
        this.chatMessages = chat.messages;
        this.currentUser = chat.userNameObs.getValue().username;
    }

    ngOnInit(): void {
        this.chat.setUser;
        this.chat.messagesObs.subscribe((messages) => {
            this.chatMessages = messages;
        });
        this.chat.fetchMessages();
    }

    @HostListener('wheel', ['$event'])
    handleMouseWheelEvent(event: WheelEvent) {
        event.stopPropagation();
    }

    ngAfterViewInit() {
        this.myInputField.nativeElement.focus();
    }

    ngAfterViewChecked() {
        if (this.newMessage) {
            const recentMessage = this.messagesInDom.last;
            recentMessage.nativeElement.scrollIntoView();
            this.newMessage = false;
        }
    }

    public sendMessage() {
        if (this.message.trim() !== '') {
            const message = {
                user: this.chat.userNameObs.value,
                message: this.message.trim(),
            };
            this.chat.sendMessage(message);
            this.message = '';
            this.newMessage = true;
            this.myInputField.nativeElement.focus();
        }
    }
}
