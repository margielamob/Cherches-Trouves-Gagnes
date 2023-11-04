import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogGameOverComponent } from '@app/components/dialog-game-over/dialog-game-over.component';
import { PlayerLeftSnackbarComponent } from '@app/components/player-left-snackbar/player-left-snackbar.component';
import { Theme } from '@app/enums/theme';
import { ClueHandlerService } from '@app/services/clue-handler-service/clue-handler.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameRecord } from '@common/game-record';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnDestroy {
    favoriteTheme: string = Theme.ClassName;
    title: string;
    clock: string;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private dialog: MatDialog,
        public gameInfoHandlerService: GameInformationHandlerService,
        exitButtonService: ExitButtonHandlerService,
        private socket: CommunicationSocketService,
        private readonly snackBar: MatSnackBar,
        private readonly clueHandlerService: ClueHandlerService,
    ) {
        exitButtonService.setGamePage();
        this.title = 'Mode ' + this.gameInfoHandlerService.gameMode + ' ' + (this.gameInfoHandlerService.isMulti ? 'Multijoueur' : 'Solo');
        this.handleSocket();
    }

    handleSocket() {
        this.socket.once(SocketEvent.Win, (record?: GameRecord) => {
            this.openGameOverDialog(true, record);
            this.clueHandlerService.resetNbClue();
        });
        this.socket.once(SocketEvent.Lose, () => {
            this.openGameOverDialog(false);
            this.clueHandlerService.resetNbClue();
        });
        this.socket.once(SocketEvent.PlayerLeft, () => {
            this.gameInfoHandlerService.isMulti = false;
            this.openSnackBar();
            this.gameInfoHandlerService.$playerLeft.next();
            this.title = 'Mode ' + this.gameInfoHandlerService.gameMode + ' Solo';
        });
    }

    ngOnDestroy(): void {
        this.clueHandlerService.resetNbClue();
        this.socket.send(SocketEvent.LeaveGame, { gameId: this.gameInfoHandlerService.roomId });
        this.socket.off(SocketEvent.Win);
        this.socket.off(SocketEvent.Lose);
        this.gameInfoHandlerService.resetGameVariables();
    }

    openSnackBar() {
        this.snackBar.openFromComponent(PlayerLeftSnackbarComponent, { duration: 5000 });
    }

    openGameOverDialog(isWin: boolean, record?: GameRecord): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '50%';
        if (this.gameInfoHandlerService.isClassic()) {
            dialogConfig.data = {
                win: isWin,
                winner: isWin ? this.gameInfoHandlerService.getPlayer().name : this.gameInfoHandlerService.getOpponent()[0].name,
                isClassic: true,
                record,
            };
        } else {
            dialogConfig.data = {
                win: isWin,
                winner: undefined,
                isClassic: false,
                nbPoints: this.findNbDifferences(),
            };
        }
        this.dialog.open(DialogGameOverComponent, dialogConfig);
    }

    private findNbDifferences(): string {
        if (this.gameInfoHandlerService.players[1]) {
            return (this.gameInfoHandlerService.players[0].nbDifferences + this.gameInfoHandlerService.players[1].nbDifferences).toString();
        }

        return this.gameInfoHandlerService.players[0].nbDifferences.toString();
    }
}
