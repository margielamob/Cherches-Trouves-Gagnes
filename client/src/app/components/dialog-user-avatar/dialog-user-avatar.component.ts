/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Avatar } from '@app/interfaces/avatar';
import { UserData } from '@app/interfaces/user';
import { ImageUploadService } from '@app/services/image-upload/image-upload.service';
import { ThemeService } from '@app/services/theme-service/theme.service';
import { UserService } from '@app/services/user-service/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dialog-user-avatar',
    templateUrl: './dialog-user-avatar.component.html',
    styleUrls: ['./dialog-user-avatar.component.scss'],
})
export class DialogUserAvatarComponent implements OnInit, OnDestroy {
    fileTypeError: string | null = null;
    selectedFileURL: string | null = null;
    selectedFile: File | null = null;
    userCamera = 'assets/camera.png';
    userAvatar: Avatar = { imagePath: '', active: true };
    defaultAvatar: Avatar = { imagePath: 'assets/default-user-icon.jpg', active: false };
    selectedAvatar: Avatar = { imagePath: '', active: false };
    avatarImages: Avatar[] = [];
    user$ = this.userService.getCurrentUser();
    userThemeSubscription: Subscription;
    currentTheme: string;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild('fileInput') fileInput: ElementRef;

    // eslint-disable-next-line max-params
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { adding: boolean; currentUserId: string },
        public dialogRef: MatDialogRef<DialogUserAvatarComponent>,
        private imageUploadService: ImageUploadService,
        private userService: UserService, //
        private translateService: TranslateService,
        private themeService: ThemeService,
    ) {}
    ngOnDestroy(): void {
        if (this.userThemeSubscription) {
            this.userThemeSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.loadFileNames();
        this.user$.subscribe((user) => {
            this.setUserAvatar(user);
        });
        this.currentTheme = this.themeService.getAppTheme();
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
        this.defaultAvatar.active = false;
    }

    setUserAvatar(user: UserData | undefined) {
        this.selectedAvatar.imagePath = this.defaultAvatar.imagePath;
        if (user?.uid === undefined) return;
        if (user?.photoURL === '') {
            return;
        }

        if (user?.photoURL?.startsWith('avatars/')) {
            this.userService.getAvatarOfSignedUser(user?.uid).subscribe({
                next: (url) => {
                    if (!url) {
                        this.userAvatar.imagePath = '';
                    } else this.userAvatar.imagePath = url;
                    this.selectedAvatar.imagePath = this.userAvatar.imagePath;
                },
                error: () => {
                    this.userAvatar.imagePath = '';
                    this.selectedAvatar.imagePath = this.defaultAvatar.imagePath;
                },
            });
        }
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
                this.fileTypeError = null;
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target) {
                        this.selectedFileURL = e.target.result as string;
                    }
                };
                reader.readAsDataURL(file);
                this.selectedFile = file;
                this.toggleBorder(this.defaultAvatar);
            } else {
                this.translateService.get('DIALOG_USER.ERROR').subscribe((translation) => {
                    this.fileTypeError = translation;
                });
            }
        }
    }

    onSubmit(): void {
        if (this.selectedFile && this.defaultAvatar.active) {
            this.imageUploadService.uploadImage(this.selectedFile, `avatars/${this.data.currentUserId}/avatar.jpg`).subscribe(() => {
                this.userService.updateUserAvatar(this.data.currentUserId, `avatars/${this.data.currentUserId}/avatar.jpg`);
                this.dialogRef.close();
            });
        }
        if (this.selectedAvatar.imagePath === this.userAvatar.imagePath) {
            this.userService.updateUserAvatar(this.data.currentUserId, `avatars/${this.data.currentUserId}/avatar.jpg`);
            this.dialogRef.close();
        } else {
            this.userService.updateUserAvatar(this.data.currentUserId, this.selectedAvatar.imagePath);
            this.dialogRef.close();
        }
    }
}
