/* eslint-disable max-params */
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { EmailService } from '@app/services/email-service/email.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { ReplayService } from '@app/services/replay-service/replay.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { UserService } from '@app/services/user-service/user.service';
// eslint-disable-next-line import/no-unresolved
import { GameRecord } from '@common/game-record';
import { take } from 'rxjs';
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
        private replayService: ReplayService,
        public gameInformationHandler: GameInformationHandlerService,
        private emailService: EmailService,
    ) {
        this.isWin = data.win;
        this.winner = data.winner;
        this.isClassic = data.isClassic;
        this.nbPoints = data.nbPoints;
        this.index = data.record ? data.record.index : null;
        this.time = data.record ? this.timeFormatter.formatTimeForScore(data.record.time) : null;
        this.userService
            .getUserTheme()

            .pipe(take(1))
            .subscribe((theme) => {
                this.theme = theme as string;
            });
    }

    toggleReplay() {
        if (this.isWin) {
            this.userService.updateUserGameWin();
        }

        this.userService.updateUserGamePlayed();
        this.isReplayToggled.emit(true);
        this.replayService.isReplayMode = true;
        this.dialog.closeAll();
    }

    quitGame() {
        this.chatManager.leaveGameChat();
        if (this.isWin) {
            this.userService.updateUserGameWin();
        }
        this.userService.updateUserGamePlayed();
        this.dialog.closeAll();
    }

    sendEmail() {
        if (this.isWin) {
            this.emailService.setWinner('Vous avez gagné');
        } else {
            this.emailService.setWinner('Vous avez perdu');
        }
        this.quitGame();
        this.emailService.sendEmail();
    }
}
