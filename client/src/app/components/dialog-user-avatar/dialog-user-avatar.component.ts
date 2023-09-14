/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Avatar } from '@app/interfaces/avatar';
import { ImageUploadService } from '@app/services/image-upload/image-upload.service';

@Component({
    selector: 'app-dialog-user-avatar',
    templateUrl: './dialog-user-avatar.component.html',
    styleUrls: ['./dialog-user-avatar.component.scss'],
})
export class DialogUserAvatarComponent implements OnInit {
    title!: string;
    defaultAvatarFolder = 'assets/avatar-predifini/';
    userAvatar = 'assets/camera.png';
    fileNames: string[] = [];
    avatarImages: Avatar[] = [];
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild('fileInput') fileInput: ElementRef;

    // eslint-disable-next-line max-params
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { adding: boolean; currentUserId: string },
        public dialogRef: MatDialogRef<DialogUserAvatarComponent>,
        private imageUploadService: ImageUploadService,
    ) {}

    ngOnInit(): void {
        this.title = 'Choissis ton avatar';
        this.loadFileNames();
    }

    loadFileNames() {
        this.avatarImages = [
            { fileName: 'avatar1.png', imagePath: 'assets/avatar-predefini/avatar1.png' },
            { fileName: 'avatar2.png', imagePath: 'assets/avatar-predefini/avatar2.png' },
            { fileName: 'avatar3.png', imagePath: 'assets/avatar-predefini/avatar3.png' },
        ];
    }

    editAvatar() {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            // Check if the selected file is a valid image (JPG or PNG)
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                // You can now upload the file to your server or perform any other actions
                this.imageUploadService.uploadImage(file, this.data.currentUserId);
            } else {
                // Invalid file type
                // eslint-disable-next-line no-console
                console.error('Invalid file type. Please select a JPG or PNG file.');
            }
        }
    }

    onSubmit(): void {
        this.dialogRef.close();
    }
}
