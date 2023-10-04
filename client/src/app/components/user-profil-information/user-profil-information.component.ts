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
    currentUserId: string | undefined;
    userAvatar: string | undefined;
    user$: Observable<UserData | undefined>;
    currentUser: UserData | undefined;

    constructor(private userService: UserService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.user$ = this.userService.getCurrentUser();
        this.user$.subscribe((user) => {
            this.currentUser = user;
            this.currentUserId = user?.uid;
            this.userAvatar = user === undefined ? 'assets/default-user-icon.jpg' : user.photoURL;
            this.setUserAvatar();
        });
    }

    setUserAvatar() {
        if (this.currentUserId === undefined) return;
        console.log(this.currentUser);
        this.userService.getImageOfSignedUser(this.currentUser?.photoURL).subscribe((url) => {
            if (url) {
                this.userAvatar = url;
            }
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
