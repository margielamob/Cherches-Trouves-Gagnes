import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-exit-game-button',
    templateUrl: './exit-game-button.component.html',
    styleUrls: ['./exit-game-button.component.scss'],
})
export class ExitGameButtonComponent {
    @ViewChild('exitDialogContent')
    private readonly exitDialogContentRef: TemplateRef<HTMLElement>;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        readonly matDialog: MatDialog,
        readonly exitButtonService: ExitButtonHandlerService,
        public gameInfoHandlerService: GameInformationHandlerService,
        private socket: CommunicationSocketService,
        private chatManager: ChatManagerService,
    ) {}

    onExit(): void {
        this.matDialog.open(this.exitDialogContentRef);
    }

    onLeaveWaiting() {
        this.chatManager.leaveGameChat();
        this.socket.send(SocketEvent.LeaveWaitingRoom, {
            roomId: this.gameInfoHandlerService.roomId,
            name: this.gameInfoHandlerService.getPlayer().name,
        });
        this.gameInfoHandlerService.resetGameVariables();
    }

    onQuiteGame() {
        this.chatManager.leaveGameChat();
    }
}
