import { Component, Input, OnInit } from '@angular/core';
import { User } from '@common/user';

@Component({
    selector: 'app-friend-card',
    templateUrl: './friend-card.component.html',
    styleUrls: ['./friend-card.component.scss'],
})
export class FriendCardComponent implements OnInit {
    @Input() friend: User;
    constructor() {}

    ngOnInit(): void {}
}
