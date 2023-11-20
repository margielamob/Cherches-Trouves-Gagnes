import { Component, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl } from '@angular/forms';
import { UserData } from '@app/interfaces/user';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'app-search-bat',
    templateUrl: './search-bat.component.html',
    styleUrls: ['./search-bat.component.scss'],
})
export class SearchBatComponent implements OnDestroy {
    friendRequestStatus: { [userId: string]: 'pending' | 'sent' | 'none' } = {};
    searchControl = new FormControl();
    users$: Observable<UserData[]>;
    private unsubscribe$ = new Subject();
    // curruntUserId : string

    constructor(private firestore: AngularFirestore) {
        this.users$ = this.searchControl.valueChanges.pipe(
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
    }

    // sendFriendRequest(userTo: UserDate) {
    //     // ...
    //     this.friendRequestService.sendFriendRequest(this.currentUserId, userTo.uid).subscribe({
    //         next: () => {
    //             console.log('Demande d’ami envoyée');
    //             this.friendRequestStatus[userTo.uid] = 'sent'; // Mettre à jour l'état
    //         },
    //         error: (error) => console.error('Erreur en envoyant la demande d’ami:', error),
    //     });
    // }

    ngOnDestroy() {
        this.unsubscribe$.next('');
        this.unsubscribe$.complete();
    }
}
