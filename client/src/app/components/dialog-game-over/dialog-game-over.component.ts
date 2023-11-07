/* eslint-disable max-params */
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { UserService } from '@app/services/user-service/user.service';
// eslint-disable-next-line import/no-unresolved
import { GameRecord } from '@common/game-record';
@Component({
    selector: 'app-dialog-game-over',
    templateUrl: './dialog-game-over.component.html',
    styleUrls: ['./dialog-game-over.component.scss'],
})
export class DialogGameOverComponent {
    @Output() isReplayToggled = new EventEmitter<boolean>();
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
        public userService: UserService,
        public dialog: MatDialog,
        private chatManager: ChatManagerService,
    ) {
        this.isWin = data.win;
        this.winner = data.winner;
        this.isClassic = data.isClassic;
        this.nbPoints = data.nbPoints;
        this.index = data.record ? data.record.index : null;
        this.time = data.record ? this.timeFormatter.formatTimeForScore(data.record.time) : null;
        this.userService
            .getUserTheme()

            .subscribe((theme) => {
                this.theme = theme as string;
            });
    }

    toggleReplay() {
        this.isReplayToggled.emit(true);
        this.dialog.closeAll();
        console.log('emmited');
    }

    quitGame() {
        this.chatManager.leaveGameChat();
        this.dialog.closeAll();
    }
}
