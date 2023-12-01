import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogGameOverComponent } from '@app/components/dialog-game-over/dialog-game-over.component';
import { PlayerLeftSnackbarComponent } from '@app/components/player-left-snackbar/player-left-snackbar.component';
import { ClueHandlerService } from '@app/services/clue-handler-service/clue-handler.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
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
    isReplayToggled: boolean = false;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private dialog: MatDialog,
        public gameInfoHandlerService: GameInformationHandlerService,
        exitButtonService: ExitButtonHandlerService,
        private socket: CommunicationSocketService,
        private readonly snackBar: MatSnackBar,
        private readonly clueHandlerService: ClueHandlerService,
        private translate: TranslateService,
        private differenceHandler: DifferencesDetectionHandlerService,
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
        this.socket.once(SocketEvent.Win, (name: string) => {
            this.openGameOverDialog(true, name);
            this.clueHandlerService.resetNbClue();
            this.differenceHandler.mouseIsDisabled = true;
            this.gameInfoHandlerService.isGameDone = true;
        });
        this.socket.once(SocketEvent.Lose, (name: string) => {
            this.openGameOverDialog(false, name);
            this.clueHandlerService.resetNbClue();
            this.differenceHandler.mouseIsDisabled = true;
            this.gameInfoHandlerService.isGameDone = true;
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
        this.differenceHandler.mouseIsDisabled = false;
        this.gameInfoHandlerService.isGameDone = false;
        this.gameInfoHandlerService.resetGameVariables();
    }

    openSnackBar() {
        this.snackBar.openFromComponent(PlayerLeftSnackbarComponent, { duration: 5000 });
    }

    openGameOverDialog(isWin: boolean, name: string): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '50%';

        if (this.gameInfoHandlerService.isClassic()) {
            dialogConfig.data = {
                win: isWin,
                winner: name,
                isClassic: true,
            };
        } else {
            dialogConfig.data = {
                win: isWin,
                winner: undefined,
                isClassic: false,
                nbPoints: this.findNbDifferences(),
            };
        }
        const dialogRef = this.dialog.open(DialogGameOverComponent, dialogConfig);

        if (this.gameInfoHandlerService.isClassic()) {
            dialogRef.componentInstance.isReplayToggled.subscribe((isReplayToggled: boolean) => {
                if (isReplayToggled) {
                    this.isReplayToggled = isReplayToggled;
                }
            });
        }
    }

    canReplay() {
        return this.isReplayToggled && this.gameInfoHandlerService.isClassic();
    }

    private findNbDifferences(): string {
        if (this.gameInfoHandlerService.players[1]) {
            return (this.gameInfoHandlerService.players[0].nbDifferences + this.gameInfoHandlerService.players[1].nbDifferences).toString();
        }

        return this.gameInfoHandlerService.players[0].nbDifferences.toString();
    }
}
