import { Component, OnInit } from '@angular/core';
import { UserData } from '@app/interfaces/user';
import { UserService } from '@app/services/user-service/user.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-user-avatar',
    templateUrl: './user-avatar.component.html',
    styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
    currentUserId: string | undefined;
    userAvatar: string | undefined;
    user$: Observable<UserData | undefined>;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.user$ = this.userService.getCurrentUser();
        this.user$.subscribe((user) => {
            this.currentUserId = user?.uid;
            this.setUserAvatar(user);
        });
    }

    setUserAvatar(user: UserData | undefined) {
        if (this.currentUserId === undefined) return;
        if (user?.photoURL === '') {
            this.userAvatar = 'assets/default-user-icon.jpg';
        } else if (user?.photoURL?.startsWith('avatars/')) {
            this.userService.getImageOfSignedUser(user?.photoURL).subscribe((url) => {
                if (url) {
                    this.userAvatar = url;
                } else {
                    this.userAvatar = 'assets/default-user-icon.jpg';
                }
            });
        } else {
            this.userAvatar = user?.photoURL ?? 'assets/default-user-icon.jpg';
        }
    }
}
