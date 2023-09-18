import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserAvatarComponent } from '@app/components/dialog-user-avatar/dialog-user-avatar.component';
import { UserData } from '@app/interfaces/user';
import { UserService } from '@app/services/user-service/user.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-user-profil-information',
    templateUrl: './user-profil-information.component.html',
    styleUrls: ['./user-profil-information.component.scss'],
})
export class UserProfilInformationComponent implements OnInit {
    currentUserId: string;
    userAvatar: string;
    user$: Observable<UserData | undefined>;

    constructor(private userService: UserService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe((user) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.currentUserId = user!.uid;
            this.setUserAvatar();
        });
    }

    // uploadFile(event: unknown, uid: string) {
    //     this.imageUploadService
    //         .uploadImage(event.target.files[0], `avatars/${uid}/avatar`)
    //         .pipe(
    //             switchMap((photoURL) =>
    //                 this.userService.updateUser({
    //                     uid,
    //                     photoURL,
    //                 }),
    //             ),
    //         )
    //         .subscribe();
    // }

    setUserAvatar() {
        if (this.currentUserId === undefined) return;
        this.userService.getImageOfSignedUser(this.currentUserId).subscribe((url) => {
            if (!url) {
                this.userAvatar = 'assets/default-user-icon.jpg';
            } else this.userAvatar = url;
        });
    }

    openUserAvatarDialog(): void {
        this.dialog.open(DialogUserAvatarComponent, {
            autoFocus: false,
            width: '70vw',
            height: '50vh',
            data: {
                adding: false,
                currentUserId: this.currentUserId,
            },
        });
    }
}
