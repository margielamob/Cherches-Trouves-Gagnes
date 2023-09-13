import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-user-avatar',
    templateUrl: './dialog-user-avatar.component.html',
    styleUrls: ['./dialog-user-avatar.component.scss'],
})
export class DialogUserAvatarComponent implements OnInit {
    title!: string;
    constructor(@Inject(MAT_DIALOG_DATA) public data: unknown, public dialogRef: MatDialogRef<DialogUserAvatarComponent>) {}

    ngOnInit(): void {
        this.title = 'Choissis ton avatar';
    }
}
