import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendRequest } from '@app/interfaces/friend-request';
import { UserData } from '@app/interfaces/user';
import { FriendRequestService } from '@app/services/friend-request-service/friend-request.service';
import { UserService } from '@app/services/user-service/user.service';
import { Observable, Subject, switchMap, take, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-friend-requests',
    templateUrl: './friend-requests.component.html',
    styleUrls: ['./friend-requests.component.scss'],
})
export class FriendRequestsComponent implements OnDestroy, OnInit {
    receivedFriendRequests$: Observable<FriendRequest[]>;
    userDetailsMap: { [uid: string]: UserData } = {}; // Map pour stocker les détails des utilisateurs
    curruntUserId: string;
    private ngUnsubscribe = new Subject<void>();

    constructor(private friendRequestService: FriendRequestService, private userService: UserService) {}

    ngOnInit() {
        this.userService
            .getCurrentUser()
            .pipe(take(1), takeUntil(this.ngUnsubscribe))
            .subscribe((user) => {
                if (user) {
                    this.curruntUserId = user.uid;
                    this.initializeFriendRequests();
                }
            });
    }

    initializeFriendRequests() {
        this.receivedFriendRequests$ = this.friendRequestService.listenForReceivedFriendRequests(this.curruntUserId).pipe(
            tap((requests) => {
                const userIds = requests.map((request) => request.from).filter((id) => !!id);
                this.updateUserDetailsMap(userIds as string[]);
            }),
            takeUntil(this.ngUnsubscribe),
        );
    }

    updateUserDetailsMap(userIds: string[]) {
        if (userIds.length > 0) {
            this.friendRequestService
                .getUsersDetailsByIds(userIds)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((users) => {
                    users.forEach((user) => {
                        if (user) this.userDetailsMap[user.uid] = user;
                    });
                });
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    declineRequest(request: FriendRequest) {
        if (!request.from || !request.to) {
            console.error('La demande d’ami est invalide.');
            return;
        }

        this.friendRequestService.cancelFriendRequest(request.from as string, request.to as string).subscribe({
            next: () => {
                console.log('Demande d’ami supprimée avec succès.');
            },
            error: (error) => {
                console.error('Erreur lors de la suppression de la demande d’ami:', error);
            },
        });
    }

    acceptRequest(request: FriendRequest): void {
        if (!request.from || !request.to) {
            console.error('La demande d’ami est invalide.');
            return;
        }

        const currentUserUid = this.curruntUserId;
        this.friendRequestService
            .addToFriendsList(currentUserUid, request.from)
            .pipe(switchMap(() => this.friendRequestService.cancelFriendRequest(request.from as string, request.to as string)))
            .subscribe({
                next: () => {
                    console.log('Demande d’ami acceptée et statut mis à jour avec succès.');
                },
                error: (error) => {
                    console.error('Erreur lors de l’acceptation de la demande d’ami:', error);
                },
            });
    }
}
