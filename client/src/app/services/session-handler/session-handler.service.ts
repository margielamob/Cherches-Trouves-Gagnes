import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, map, take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SessionHandlerService {
    constructor(private afs: AngularFirestore) {}

    addSession(userUid: string) {
        return from(this.afs.collection('sessions').doc(userUid).set({ time: new Date() }));
    }

    async deleteSession(userUid: string) {
        return from(this.afs.collection('sessions').doc(userUid).delete());
    }

    checkIfSessionExists(userUid: string): Observable<boolean> {
        return this.afs
            .collection('sessions')
            .doc(userUid)
            .valueChanges()
            .pipe(
                map((data) => !!data), // return true if document exist
                take(1),
            );
    }

    logSessionActivity(userUid: string, activity: string) {
        const log = {
            activity,
            timestamp: new Date(),
        };
        return from(this.afs.collection('users').doc(userUid).collection('activityLogs').add(log));
    }
}
