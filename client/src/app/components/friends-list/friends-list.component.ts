import { Component } from '@angular/core';
import { UserData } from '@app/interfaces/user';
import { UserService } from '@app/services/user-service/user.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-friends-list',
    templateUrl: './friends-list.component.html',
    styleUrls: ['./friends-list.component.scss'],
})
export class FriendsListComponent {
    currentUserId = this.userService.activeUser.uid;
    friends$: Observable<UserData[]>;

    constructor(private userService: UserService) {
        this.friends$ = this.userService.getFriends();
    }

    removeFriend(friendUid: string) {
        this.userService.deleteFriend(this.currentUserId, friendUid).subscribe({
            error: (error) => {
                throw error;
            },
        });
    }
}
