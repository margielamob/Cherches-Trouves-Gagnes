import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, switchMap, take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FriendRequestService {
    constructor(private firestore: AngularFirestore) {}

    sendFriendRequest(fromUserId: string, toUserId: string): Observable<unknown> {
        const sortedIds = [fromUserId, toUserId].sort();
        const uniqueKey = sortedIds.join('_');

        const friendRequest = {
            from: fromUserId,
            to: toUserId,
            uniqueKey,
        };

        return from(this.firestore.collection('friendRequests').add(friendRequest));
    }

    cancelFriendRequest(fromUserId: string, toUserId: string): Observable<void> {
        const sortedIds = [fromUserId, toUserId].sort();
        const uniqueKey = sortedIds.join('_');

        return this.firestore
            .collection('friendRequests', (ref) => ref.where('uniqueKey', '==', uniqueKey))
            .get()
            .pipe(
                take(1),
                switchMap((querySnapshot) => {
                    const doc = querySnapshot.docs[0];
                    if (doc) {
                        return from(doc.ref.delete());
                    } else {
                        throw new Error('Demande d’ami non trouvée');
                    }
                }),
            );
    }
}
