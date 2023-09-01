import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { Theme } from '@app/enums/theme';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
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

    theme = Theme.ClassName;
    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        readonly matDialog: MatDialog,
        readonly exitButtonService: ExitButtonHandlerService,
        public gameInfoHandlerService: GameInformationHandlerService,
        private socket: CommunicationSocketService,
    ) {}

    onExit(): void {
        this.matDialog.open(this.exitDialogContentRef);
    }

    onLeaveWaiting() {
        if (this.gameInfoHandlerService.roomId) {
            this.socket.send(SocketEvent.LeaveWaiting, { roomId: this.gameInfoHandlerService.roomId, gameCard: this.gameInfoHandlerService.getId() });
        } else {
            this.socket.send(SocketEvent.LeaveWaiting, { roomId: undefined, gameCard: this.gameInfoHandlerService.getId() });
        }
    }
}
