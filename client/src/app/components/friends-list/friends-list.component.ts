import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user-service/user.service';

@Component({
    selector: 'app-friends-list',
    templateUrl: './friends-list.component.html',
    styleUrls: ['./friends-list.component.scss'],
})
export class FriendsListComponent implements OnInit {
    constructor(private userService: UserService) {}

    ngOnInit() {
        this.userService.getFriends().subscribe((friends) => {
            console.log(friends);
        });

    }
}
