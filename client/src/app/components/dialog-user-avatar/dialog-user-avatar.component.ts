/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Avatar } from '@app/interfaces/avatar';
import { ImageUploadService } from '@app/services/image-upload/image-upload.service';
import { UserService } from '@app/services/user-service/user.service';

@Component({
    selector: 'app-dialog-user-avatar',
    templateUrl: './dialog-user-avatar.component.html',
    styleUrls: ['./dialog-user-avatar.component.scss'],
})
export class DialogUserAvatarComponent implements OnInit {
    title!: string;
    userCamera = 'assets/camera.png';
    userAvatar: Avatar = { imagePath: '', active: true };
    selectedAvatar: Avatar = { imagePath: '', active: false };
    avatarImages: Avatar[] = [];
    user$ = this.userService.getCurrentUser();

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild('fileInput') fileInput: ElementRef;

    // eslint-disable-next-line max-params
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { adding: boolean; currentUserId: string },
        public dialogRef: MatDialogRef<DialogUserAvatarComponent>,
        private imageUploadService: ImageUploadService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.title = 'Choissis ton avatar';
        this.loadFileNames();
        this.setUserAvatar();
    }

    toggleBorder(avatar: Avatar) {
        this.disableBorder();
        avatar.active = !avatar.active;
        this.selectedAvatar.imagePath = avatar.imagePath;
    }

    disableBorder() {
        this.avatarImages.forEach((avatarImage) => {
            avatarImage.active = false;
        });
        this.userAvatar.active = false;
    }

    setUserAvatar() {
        if (this.data.currentUserId === undefined) return;
        this.userService.getAvatarOfSignedUser(this.data.currentUserId).subscribe((url) => {
            if (!url) {
                this.userAvatar.imagePath = 'assets/default-user-icon.jpg';
            } else this.userAvatar.imagePath = url;
            this.selectedAvatar.imagePath = this.userAvatar.imagePath;
        });
        this.userService.updateUserByID(this.data.currentUserId);
    }

    loadFileNames() {
        this.avatarImages = [
            { imagePath: 'assets/avatar-predefini/avatar2.png', active: false },
            { imagePath: 'assets/avatar-predefini/avatar3.png', active: false },
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
                this.imageUploadService.uploadImage(file, `avatars/${this.data.currentUserId}/avatar.jpg`);
                this.setUserAvatar();
                this.selectedAvatar.imagePath = this.userAvatar.imagePath;
            } else {
                // eslint-disable-next-line no-console
                console.error('Invalid file type. Please select a JPG or PNG file.');
            }
        }
    }

    onSubmit(): void {
        if (this.selectedAvatar.imagePath === this.userAvatar.imagePath) {
            this.userService.updateUserAvatar(this.data.currentUserId, `avatars/${this.data.currentUserId}/avatar.jpg`);
            this.dialogRef.close();
        } else {
            this.userService.updateUserAvatar(this.data.currentUserId, this.selectedAvatar.imagePath);
            this.dialogRef.close();
        }
    }
}
