import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUserAvatarComponent } from '@app/components/dialog-user-avatar/dialog-user-avatar.component';
import { UserService } from '@app/services/user-service/user.service';

@Component({
    selector: 'app-user-profil-information',
    templateUrl: './user-profil-information.component.html',
    styleUrls: ['./user-profil-information.component.scss'],
})
export class UserProfilInformationComponent implements OnInit {
    currentUserId: string;
    userAvatar: string;

    constructor(private userService: UserService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe((user) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.currentUserId = user!.uid;
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
}
