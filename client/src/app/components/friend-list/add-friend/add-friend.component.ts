import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FriendManagerService } from '@app/services/friend-list/friend-manager.service';
import { User } from '@common/user';
import { debounceTime, of, startWith, switchMap } from 'rxjs';

const time = 200;

@Component({
    selector: 'app-add-friend',
    templateUrl: './add-friend.component.html',
    styleUrls: ['./add-friend.component.scss'],
})
export class AddFriendComponent implements OnInit {
    addableUsers: User[] = [];
    search = new FormControl();
    $search = this.search.valueChanges.pipe(
        startWith(null),
        debounceTime(time),
        switchMap((res: string) => {
            if (!res) return of(this.addableUsers);
            res = res.toLowerCase();
            return of(this.addableUsers.filter((x) => x.name.toLowerCase().indexOf(res) >= 0));
        }),
    );

    constructor(private friendManager: FriendManagerService) {}

    ngOnInit(): void {
        this.friendManager.addableUsers.subscribe((users) => {
            this.addableUsers = users;
        });
    }
}
