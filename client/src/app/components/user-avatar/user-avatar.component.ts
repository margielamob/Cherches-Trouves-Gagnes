import { Component, Input, OnInit } from '@angular/core';
import { UserData } from '@app/interfaces/user';
import { UserService } from '@app/services/user-service/user.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-user-avatar',
    templateUrl: './user-avatar.component.html',
    styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
    @Input() userAvatar: string | undefined;
    currentUserId: string | undefined;
    user$: Observable<UserData | undefined>;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.setUserAvatar(this.userAvatar);
    }

    setUserAvatar(photoURL: string | undefined) {
        this.userAvatar = 'assets/default-user-icon.jpg';
        if (photoURL?.startsWith('avatars/')) {
            this.userService.getImageOfSignedUser(photoURL).subscribe((url) => {
                this.userAvatar = url ? url : 'assets/default-user-icon.jpg';
            });
        } else {
            this.userAvatar = photoURL ?? 'assets/default-user-icon.jpg';
        }
    }
}
