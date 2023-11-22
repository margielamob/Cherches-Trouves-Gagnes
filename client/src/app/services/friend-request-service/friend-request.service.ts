import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FriendRequest } from '@app/interfaces/friend-request';
import { UserData } from '@app/interfaces/user';
import { Observable, forkJoin, from, map, switchMap, take } from 'rxjs';

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

    getUserData(userId: string): Observable<UserData | undefined> {
        return this.firestore.collection('users').doc<UserData>(userId).valueChanges();
    }

    getSentFriendRequestUpdates(userId: string): Observable<FriendRequest[]> {
        return this.firestore
            .collection<FriendRequest>('friendRequests', (ref) => ref.where('from', '==', userId))
            .snapshotChanges()
            .pipe(
                map((actions) =>
                    actions.map((a) => {
                        const data = a.payload.doc.data() as FriendRequest;
                        const docId = a.payload.doc.id;
                        return { docId, ...data };
                    }),
                ),
            );
    }

    listenForReceivedFriendRequests(userId: string): Observable<FriendRequest[]> {
        return this.firestore
            .collection<FriendRequest>('friendRequests', (ref) => ref.where('to', '==', userId))
            .snapshotChanges()
            .pipe(
                map((changes) =>
                    changes.map((change) => {
                        const data = change.payload.doc.data() as FriendRequest;
                        const docId = change.payload.doc.id;
                        return { ...data, docId };
                    }),
                ),
            );
    }

    getUsersDetailsByIds(userIds: string[]): Observable<UserData[]> {
        return this.firestore.collection<UserData>('users', (ref) => ref.where('uid', 'in', userIds)).valueChanges();
    }

    updateFriendRequestStatus(requesterUid: string, currentUserUid: string, status: string): Observable<void> {
        return this.firestore
            .collection('friendRequests', (ref) => ref.where('from', '==', requesterUid).where('to', '==', currentUserUid))
            .get()
            .pipe(
                switchMap((querySnapshot) => {
                    const batch = this.firestore.firestore.batch();
                    querySnapshot.forEach((doc) => {
                        batch.update(doc.ref, { status });
                    });
                    return from(batch.commit());
                }),
            );
    }

    addToFriendsList(currentUserUid: string, requesterUid: string): Observable<unknown> {
        const currentUserDocRef = this.firestore.doc<UserData>(`users/${currentUserUid}`);
        const requesterUserDocRef = this.firestore.doc<UserData>(`users/${requesterUid}`);

        return forkJoin({
            currentUser: currentUserDocRef.valueChanges().pipe(take(1)),
            requesterUser: requesterUserDocRef.valueChanges().pipe(take(1)),
        }).pipe(
            switchMap(({ currentUser, requesterUser }) => {
                const updatedCurrentUserFriendsList = currentUser?.friends ? [...currentUser.friends] : [];
                if (!updatedCurrentUserFriendsList.includes(requesterUid)) {
                    updatedCurrentUserFriendsList.push(requesterUid);
                }

                const updatedRequesterFriendsList = requesterUser?.friends ? [...requesterUser.friends] : [];
                if (!updatedRequesterFriendsList.includes(currentUserUid)) {
                    updatedRequesterFriendsList.push(currentUserUid);
                }

                const updates = [];
                updates.push(currentUserDocRef.update({ friends: updatedCurrentUserFriendsList }));
                updates.push(requesterUserDocRef.update({ friends: updatedRequesterFriendsList }));

                return forkJoin(updates);
            }),
        );
    }

    // deleterFriendRequest(requesterUid: string, currentUserUid: string): Observable<void> {
    //     return this.firestore
    //         .collection('friendRequests', (ref) => ref.where('from', '==', requesterUid).where('to', '==', currentUserUid))
    //         .get()
    //         .pipe(
    //             switchMap((querySnapshot) => {
    //                 const batch = this.firestore.firestore.batch();
    //                 querySnapshot.forEach((doc) => {
    //                     batch.delete(doc.ref);
    //                 });
    //                 return from(batch.commit());
    //             }),
    //         );
    // }
}
