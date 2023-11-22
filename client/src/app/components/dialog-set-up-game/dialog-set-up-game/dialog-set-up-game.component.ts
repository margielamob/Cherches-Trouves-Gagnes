import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
@Component({
    selector: 'app-dialog-set-up-game',
    templateUrl: './dialog-set-up-game.component.html',
    styleUrls: ['./dialog-set-up-game.component.scss'],
})
export class DialogSetUpGameComponent {
    duration: number;
    bonus: number;
    cheatMode: boolean = false;
    isLimited: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<DialogSetUpGameComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { type: string },
        private gameInfoService: GameInformationHandlerService,
    ) {
        this.isLimited = data.type === 'limited';
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onConfirm(): void {
        this.gameInfoService.startTimer = this.duration;
        this.dialogRef.close({
            duration: this.duration,
            cheatMode: this.cheatMode,
            bonus: this.isLimited ? this.bonus : null,
        });
    }
}
