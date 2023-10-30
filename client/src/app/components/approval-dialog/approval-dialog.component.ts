import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlayerLeftSnackbarComponent } from '@app/components/player-left-snackbar/player-left-snackbar.component';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { RouterService } from '@app/services/router-service/router.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-approval-dialog',
    templateUrl: './approval-dialog.component.html',
    styleUrls: ['./approval-dialog.component.scss'],
})
export class ApprovalDialogComponent {
    @Input() opponentsName: string;
    favoriteTheme: string;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            opponentsName: string;
            opponentsRoomId: string;
        },
        public socketService: CommunicationSocketService,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private readonly routerService: RouterService,
        private readonly snackBar: MatSnackBar,
    ) {
        this.opponentsName = data.opponentsName;
    }

    onClickApprove() {
        this.socketService.on(SocketEvent.PlayerLeft, () => {
            this.openSnackBar();
            return;
        });
        this.gameInformationHandlerService.setPlayerName(this.opponentsName);
        this.socketService.send(SocketEvent.AcceptPlayer, {
            gameId: this.gameInformationHandlerService.roomId,
            opponentsRoomId: this.data.opponentsRoomId,
            playerName: this.gameInformationHandlerService.getPlayer().name,
        });

        this.socketService.on(SocketEvent.Play, (id: string) => {
            this.gameInformationHandlerService.roomId = id;
            this.routerService.navigateTo('game');
        });
    }

    onClickReject() {
        this.gameInformationHandlerService.isReadyToAccept = true;
        this.socketService.send(SocketEvent.RejectPlayer, {
            roomId: this.gameInformationHandlerService.roomId,
            opponentsRoomId: this.data.opponentsRoomId,
        });
    }

    openSnackBar() {
        this.snackBar.openFromComponent(PlayerLeftSnackbarComponent, { duration: 3000 });
    }
}
