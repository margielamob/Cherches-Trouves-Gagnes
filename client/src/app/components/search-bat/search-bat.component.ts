import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { FriendRequest } from '@app/interfaces/friend-request';
import { UserData } from '@app/interfaces/user';
import { FriendRequestService } from '@app/services/friend-request-service/friend-request.service';
import { UserService } from '@app/services/user-service/user.service';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap, take, takeUntil } from 'rxjs';

@Component({
    selector: 'app-search-bat',
    templateUrl: './search-bat.component.html',
    styleUrls: ['./search-bat.component.scss'],
})
export class SearchBatComponent implements OnInit {
    friendRequestStatus: { [userId: string]: FriendRequest } = {};
    searchControl = new FormControl();
    users$: Observable<UserData[]>;
    currentUserId: string;
    private unsubscribe$ = new Subject();

    constructor(private firestore: AngularFirestore, private userService: UserService, private friendRequestService: FriendRequestService) {
        this.users$ = this.searchControl.valueChanges.pipe(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((searchTerm) =>
                this.firestore
                    .collection<UserData>('users', (ref) =>
                        ref.where('displayName', '>=', searchTerm).where('displayName', '<=', searchTerm + '\uf8ff'),
                    )
                    .valueChanges(),
            ),
            takeUntil(this.unsubscribe$),
        );

        this.userService
            .getCurrentUser()
            .pipe(take(1))
            .subscribe((user) => {
                if (user) this.currentUserId = user.uid;
            });
    }

    ngOnInit() {
        this.userService.getCurrentUser().subscribe((user) => {
            if (user) {
                this.currentUserId = user.uid;
                this.listenForFriendRequestUpdates();
                this.listenForSentFriendRequestUpdates();
            }
        });
    }

    sendFriendRequest(userTo: UserData) {
        if (!this.friendRequestStatus[userTo.uid]) {
            this.friendRequestService.sendFriendRequest(this.currentUserId, userTo.uid).subscribe({
                next: (docId) => {
                    // Stockez l'ID du document Firestore dans l'objet de statut
                    this.friendRequestStatus[userTo.uid] = { status: 'pending', docId: docId as string };
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
            next: () => {
                console.log('Demande d’ami annulée');
            },
            error: (error) => {
                throw error;
            },
        });
    }

    listenForSentFriendRequestUpdates() {
        this.friendRequestService
            .getSentFriendRequestUpdates(this.currentUserId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((requests) => {
                requests.forEach((request) => {
                    if (request.to) {
                        this.friendRequestStatus[request.to] = {
                            from: request.from,
                            to: request.to,
                            status: request.status,
                            uniqueKey: request.uniqueKey,
                            docId: request.docId,
                        };
                    }
                });
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
