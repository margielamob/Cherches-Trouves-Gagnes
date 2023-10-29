import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';
import { ReplayService } from '@app/services/replay-service/replay.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { GameRecord } from '@common/game-record';

@Component({
    selector: 'app-dialog-game-over',
    templateUrl: './dialog-game-over.component.html',
    styleUrls: ['./dialog-game-over.component.scss'],
})
export class DialogGameOverComponent {
    isReplayPaused: boolean;
    isWin: boolean;
    winner: string;
    nbPoints: string;
    isClassic: boolean;
    index: number | null;
    time: string | null;
    theme: string;

    // eslint-disable-next-line max-params
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { win: boolean; winner: string; isClassic: boolean; nbPoints: string; record: GameRecord },
        private readonly timeFormatter: TimeFormatterService,
        private readonly replayService: ReplayService,
        public dialog: MatDialog,
    ) {
        this.isReplayPaused = false;
        this.isWin = data.win;
        this.winner = data.winner;
        this.isClassic = data.isClassic;
        this.nbPoints = data.nbPoints;
        this.index = data.record ? data.record.index : null;
        this.time = data.record ? this.timeFormatter.formatTimeForScore(data.record.time) : null;
        this.theme = Theme.ClassName;
    }

    replay() {
        this.replayService.startReplay();
        this.replayService.restartTimer();
        this.dialog.closeAll();
    }

    leaveGame(): void {
        this.replayService.resetReplay();
    }

    quitGame() {
        this.leaveGame();
        this.dialog.closeAll();
    }
}
