import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { FriendRequest } from '@app/interfaces/friend-request';
import { UserData } from '@app/interfaces/user';
import { FriendRequestService } from '@app/services/friend-request-service/friend-request.service';
import { UserService } from '@app/services/user-service/user.service';
import { Observable, Subject, combineLatest, debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'app-search-bat',
    templateUrl: './search-bat.component.html',
    styleUrls: ['./search-bat.component.scss'],
})
export class SearchBatComponent implements OnInit, OnDestroy {
    friendRequestStatus: { [userId: string]: FriendRequest } = {};
    searchControl = new FormControl();
    users$: Observable<UserData[]>;
    currentUserId: string;
    currentUserFriends$: Observable<string[]>; // Observable des ID d'amis
    private unsubscribe$ = new Subject();

    constructor(private firestore: AngularFirestore, private userService: UserService, private friendRequestService: FriendRequestService) {
        // Initialisez currentUserFriends$ pour qu'il émette la liste d'amis en temps réel
        this.currentUserFriends$ = this.userService.getFriends().pipe(
            map((friends) => friends.map((friend) => friend.uid)),
            startWith([]), // Commence avec un tableau vide pour éviter les erreurs si getFriends() est lent
        );

        // Combinez les utilisateurs recherchés avec la liste d'amis pour filtrer ceux qui ne doivent pas apparaître
        this.users$ = combineLatest([
            this.searchControl.valueChanges.pipe(
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                debounceTime(500),
                distinctUntilChanged(),
                switchMap((searchTerm) =>
                    this.firestore
                        .collection<UserData>('users', (ref) =>
                            ref
                                .where('displayName', '>=', searchTerm)
                                .where('displayName', '<=', searchTerm + '\uf8ff')
                                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                                .limit(5),
                        )
                        .valueChanges({ idField: 'uid' }),
                ),
                takeUntil(this.unsubscribe$),
            ),
            this.currentUserFriends$,
        ]).pipe(
            map(([users, friends]) =>
                users.map((user) => ({
                    ...user,
                    isFriend: friends.includes(user.uid),
                    isCurrentUser: user.uid === this.currentUserId,
                })),
            ),
        );
    }

    ngOnInit() {
        this.userService.getCurrentUser().subscribe((user) => {
            if (user) {
                this.currentUserId = user.uid;
                this.listenForFriendRequestUpdates();
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next('');
        this.unsubscribe$.complete();
    }

    sendFriendRequest(userTo: UserData) {
        if (!this.friendRequestStatus[userTo.uid]) {
            this.friendRequestService.sendFriendRequest(this.currentUserId, userTo.uid).subscribe({
                next: (docId) => {
                    this.friendRequestStatus[userTo.uid] = { docId: docId as string };
                },
                error: (error) => {
                    delete this.friendRequestStatus[userTo.uid];
                    throw error;
                },
            });
        }
    }

    cancelFriendRequest(userTo: UserData) {
        this.friendRequestService.cancelFriendRequest(this.currentUserId, userTo.uid).subscribe({
            error: (error) => {
                throw error;
            },
        });
    }

    listenForFriendRequestUpdates() {
        this.friendRequestService
            .getSentFriendRequestUpdates(this.currentUserId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((requests) => {
                this.friendRequestStatus = {};

                requests.forEach((request) => {
                    if (request.to) {
                        this.friendRequestStatus[request.to] = request;
                    }
                });
            });
    }
}
