import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { UserData } from '@app/interfaces/user';
import { FriendRequestService } from '@app/services/friend-request-service/friend-request.service';
import { UserService } from '@app/services/user-service/user.service';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'app-search-bat',
    templateUrl: './search-bat.component.html',
    styleUrls: ['./search-bat.component.scss'],
})
export class SearchBatComponent {
    friendRequestStatus: { [userId: string]: 'pending' | 'sent' | 'none' | 'cancelled' } = {};
    searchControl = new FormControl();
    users$: Observable<UserData[]>;
    currentUserId: string;
    private unsubscribe$ = new Subject();

    constructor(private firestore: AngularFirestore, private userService: UserService, private friendRequestService: FriendRequestService) {
        this.users$ = this.searchControl.valueChanges.pipe(
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            debounceTime(500),
            distinctUntilChanged(), // Seulement si la valeur a changé
            switchMap((searchTerm) =>
                this.firestore
                    .collection<UserData>('users', (ref) =>
                        ref.where('displayName', '>=', searchTerm).where('displayName', '<=', searchTerm + '\uf8ff'),
                    )
                    .valueChanges(),
            ),
            takeUntil(this.unsubscribe$), // Nettoyage à la destruction du composant
        );

        this.userService.getCurrentUser().subscribe((user) => {
            if (user) this.currentUserId = user.uid;
        });
    }

    sendFriendRequest(userTo: UserData) {
        this.friendRequestService.sendFriendRequest(this.currentUserId, userTo.uid).subscribe({
            next: () => {
                this.friendRequestStatus[userTo.uid] = 'sent';
                console.log('Demande d’ami envoyée');
            },
            error: (error) => {
                console.error('Erreur en envoyant la demande d’ami:', error);
                // Gestion des erreurs, éventuellement réinitialiser le statut
            },
        });
    }

    cancelFriendRequest(userTo: UserData) {
        this.friendRequestService.cancelFriendRequest(this.currentUserId, userTo.uid).subscribe({
            next: () => {
                this.friendRequestStatus[userTo.uid] = 'none';
                console.log('Demande d’ami annulée');
            },
            error: (error) => {
                console.error('Erreur lors de l’annulation de la demande d’ami:', error);
                // Gestion des erreurs
            },
        });
    }
}
