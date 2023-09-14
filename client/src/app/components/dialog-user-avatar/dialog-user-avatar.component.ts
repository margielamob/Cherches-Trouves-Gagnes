import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Avatar } from '@app/interfaces/avatar';

@Component({
    selector: 'app-dialog-user-avatar',
    templateUrl: './dialog-user-avatar.component.html',
    styleUrls: ['./dialog-user-avatar.component.scss'],
})
export class DialogUserAvatarComponent implements OnInit {
    title!: string;
    defaultAvatarFolder = 'assets/avatar-predifini/';
    fileNames: string[] = [];
    avatarImages: Avatar[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: unknown,
        public dialogRef: MatDialogRef<DialogUserAvatarComponent>,
        private elementRef: ElementRef,
    ) {}

    ngOnInit(): void {
        this.title = 'Choissis ton avatar';
        this.loadFileNames();
    }

    onFileSelected(event: unknown) {
        const fileInput = this.elementRef.nativeElement.querySelector('#fileInput');
        const file = fileInput.files[0];

        if (file) {
            // You can work with the selected file here.
            console.log('Selected File:', file);
        }
    }

    loadFileNames() {
        this.avatarImages = [
            { fileName: 'avatar1.png', imagePath: 'assets/avatar-predefini/avatar1.png' },
            { fileName: 'avatar2.png', imagePath: 'assets/avatar-predefini/avatar2.png' },
            { fileName: 'avatar3.png', imagePath: 'assets/avatar-predefini/avatar3.png' },
        ];
    }

    onSubmit(): void {
        this.dialogRef.close();
    }
}
