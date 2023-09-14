/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserAvatarComponent } from '@app/components/dialog-user-avatar/dialog-user-avatar.component';
import { ImageUploadService } from '@app/services/image-upload/image-upload.service';
import { UserService } from '@app/services/user-service/user.service';

@Component({
    selector: 'app-user-profil-information',
    templateUrl: './user-profil-information.component.html',
    styleUrls: ['./user-profil-information.component.scss'],
})
export class UserProfilInformationComponent implements OnInit {
    currentUserId: string | undefined;
    userAvatar: string;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(private userService: UserService, private imageUploadService: ImageUploadService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe((user) => {
            this.currentUserId = user?.uid;
            this.setUserAvatar();
        });
    }

    setUserAvatar() {
        if (this.currentUserId === undefined) return;
        if (this.userService.doesUserAvatarExist(this.currentUserId)) {
            this.userAvatar = 'assets/default-user-icon.jpg';
            return;
        }
        this.userService.getImageOfSignedUser(this.currentUserId).subscribe((url) => {
            this.userAvatar = url;
        });
    }

    editAvatar() {
        this.fileInput.nativeElement.click();
    }

    openUserAvatarDialog(): void {
        this.dialog.open(DialogUserAvatarComponent, {
            autoFocus: false,
            width: '50vw',
            height: '30vh',
            data: {
                adding: false,
                currentUserId: this.currentUserId,
            },
        });
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            // Check if the selected file is a valid image (JPG or PNG)
            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                // You can now upload the file to your server or perform any other actions
                this.imageUploadService.uploadImage(file, 'ZDGkOh1uWxUDhp6q9p3NR8u4Zil2');
            } else {
                // Invalid file type
                // eslint-disable-next-line no-console
                console.error('Invalid file type. Please select a JPG or PNG file.');
            }
        }
    }
}
