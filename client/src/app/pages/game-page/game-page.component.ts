import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogGameOverComponent } from '@app/components/dialog-game-over/dialog-game-over.component';
import { PlayerLeftSnackbarComponent } from '@app/components/player-left-snackbar/player-left-snackbar.component';
import { ClueHandlerService } from '@app/services/clue-handler-service/clue-handler.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameRecord } from '@common/game-record';
import { SocketEvent } from '@common/socket-event';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnDestroy {
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
        private translate: TranslateService,
    ) {
        exitButtonService.setGamePage();
        const gameModeKey = 'GAME_MODE.' + this.gameInfoHandlerService.gameMode.replace(/\s+/g, '').toUpperCase();
        const multiplayerKey = this.gameInfoHandlerService.isMulti ? 'GAME_MODE.MULTIPLAYER' : 'GAME_MODE.SOLO';

        const gameModeTranslation = this.translate.instant(gameModeKey);
        const multiplayerTranslation = this.translate.instant(multiplayerKey);

        this.title = `${gameModeTranslation} ${multiplayerTranslation}`;
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

            const gameModeTranslationKey = `GAME_MODE.${this.gameInfoHandlerService.gameMode.replace(/\s+/g, '').toUpperCase()}`;
            const gameModeTranslation = this.translate.instant(gameModeTranslationKey);
            const multiplayerTranslation = this.gameInfoHandlerService.isMulti
                ? this.translate.instant('GAME_MODE.MULTIPLAYER')
                : this.translate.instant('GAME_MODE.SOLO');

            this.title = `${gameModeTranslation} ${multiplayerTranslation}`;
        });
    }

    ngOnDestroy(): void {
        this.clueHandlerService.resetNbClue();
        this.socket.send(SocketEvent.LeaveGame, { gameId: this.gameInfoHandlerService.roomId });
        this.socket.off(SocketEvent.Win);
        this.socket.off(SocketEvent.Lose);
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
                winner: isWin ? this.gameInfoHandlerService.getPlayer().name : this.gameInfoHandlerService.getOpponent().name,
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
