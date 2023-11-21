import { Component, OnDestroy } from '@angular/core';
import { FriendRequest } from '@app/interfaces/friend-request';
import { UserData } from '@app/interfaces/user';
import { FriendRequestService } from '@app/services/friend-request-service/friend-request.service';
import { UserService } from '@app/services/user-service/user.service';
import { Observable, Subject, of, switchMap, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-friend-requests',
    templateUrl: './friend-requests.component.html',
    styleUrls: ['./friend-requests.component.scss'],
})
export class FriendRequestsComponent implements OnDestroy {
    receivedFriendRequests$: Observable<FriendRequest[]>;
    userDetailsMap: { [uid: string]: UserData } = {}; // Map pour stocker les détails des utilisateurs
    private ngUnsubscribe = new Subject<void>();

    constructor(private friendRequestService: FriendRequestService, private userService: UserService) {
        this.receivedFriendRequests$ = this.userService.getCurrentUser().pipe(
            switchMap((user) => {
                return user ? this.friendRequestService.listenForReceivedFriendRequests(user.uid) : of([]);
            }),
            tap((requests) => {
                const userIds = requests.map((request) => request.from).filter((id): id is string => !!id);
                if (userIds.length > 0) {
                    this.friendRequestService
                        .getUsersDetailsByIds(userIds)
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe((users) => {
                            // Remplir userDetailsMap avec les détails des utilisateurs
                            users.forEach((user) => {
                                if (user) this.userDetailsMap[user.uid] = user;
                            });
                        });
                }
            }),
            takeUntil(this.ngUnsubscribe),
        );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    declineRequest(_t11: FriendRequest) {
        throw new Error('Method not implemented.');
    }
    acceptRequest(_t11: FriendRequest) {
        throw new Error('Method not implemented.');
    }
}
