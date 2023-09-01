import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { GameRecord } from '@common/game-record';

@Component({
    selector: 'app-dialog-game-over',
    templateUrl: './dialog-game-over.component.html',
    styleUrls: ['./dialog-game-over.component.scss'],
})
export class DialogGameOverComponent {
    isWin: boolean;
    winner: string;
    nbPoints: string;
    isClassic: boolean;
    index: number | null;
    time: string | null;
    theme: string;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { win: boolean; winner: string; isClassic: boolean; nbPoints: string; record: GameRecord },
        private readonly timeFormatter: TimeFormatterService,
        public dialog: MatDialog,
    ) {
        this.isWin = data.win;
        this.winner = data.winner;
        this.isClassic = data.isClassic;
        this.nbPoints = data.nbPoints;
        this.index = data.record ? data.record.index : null;
        this.time = data.record ? this.timeFormatter.formatTimeForScore(data.record.time) : null;
        this.theme = Theme.ClassName;
    }

    quitGame() {
        this.dialog.closeAll();
    }
}
