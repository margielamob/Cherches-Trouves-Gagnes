import { Component, OnInit } from '@angular/core';
import { FriendManagerService } from '@app/services/friend-list/friend-manager.service';
import { User } from '@common/user';

@Component({
    selector: 'app-friend-list',
    templateUrl: './friend-list.component.html',
    styleUrls: ['./friend-list.component.scss'],
})
export class FriendListComponent implements OnInit {
    friends: User[] = [];

    constructor(private friendManager: FriendManagerService) {}

    ngOnInit(): void {
        this.friendManager.friends.subscribe((friends) => {
            this.friends = friends;
        });
    }
}
