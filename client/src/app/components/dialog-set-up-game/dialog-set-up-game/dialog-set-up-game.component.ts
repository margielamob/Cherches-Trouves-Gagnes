import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
    selector: 'app-dialog-set-up-game',
    templateUrl: './dialog-set-up-game.component.html',
    styleUrls: ['./dialog-set-up-game.component.scss'],
})
export class DialogSetUpGameComponent {
    duration: number;
    cheatMode: boolean = false;

    constructor(public dialogRef: MatDialogRef<DialogSetUpGameComponent>) {}

    onCancel(): void {
        this.dialogRef.close();
    }

    onConfirm(): void {
        this.dialogRef.close({
            duration: this.duration,
            cheatMode: this.cheatMode,
        });
    }
}
