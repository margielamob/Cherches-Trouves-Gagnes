import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UserData } from '@app/interfaces/user';
import { Observable, catchError, from, map, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    user$: Observable<UserData | undefined>;
    constructor(private afs: AngularFirestore, private storage: AngularFireStorage, private afAuth: AngularFireAuth) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap((user) => {
                if (user) {
                    return this.afs.collection('users').doc<UserData>(user.uid).valueChanges();
                } else {
                    return [];
                }
            }),
        );
    }

    adduser(user: UserData) {
        return from(this.afs.collection('users').doc(user.uid).set(user));
    }

    deleteUser(user: UserData) {
        return from(this.afs.collection('users').doc(user.uid).delete());
    }

    isUserNameAvailable(userName: string): Observable<boolean> {
        return this.afs
            .collection('users', (ref) => ref.where('displayName', '==', userName))
            .get()
            .pipe(
                map((resut) => {
                    if (!resut.empty) {
                        return false;
                    } else {
                        return true;
                    }
                }),
            );
    }

    getUserByUserName(userName: string) {
        return this.afs
            .collection('users', (ref) => ref.where('displayName', '==', userName))
            .get()
            .pipe(
                map((resut) => {
                    if (!resut.empty) {
                        return resut.docs[0].data() as UserData;
                    } else {
                        return null;
                    }
                }),
            );
    }
    updateUser(user: UserData) {
        return from(this.afs.collection('users').doc(user.uid).update(user)).pipe(
            catchError((error) => {
                throw error;
            }),
        );
    }

    doesUserAvatarExist(uid: string) {
        return this.storage
            .ref(`avatars/${uid}/avatar.jpg`)
            .getMetadata()
            .pipe(
                map((metadata) => {
                    if (metadata) {
                        return true;
                    } else {
                        return false;
                    }
                }),
                catchError((error) => {
                    throw error;
                }),
            );
    }

    getImageOfSignedUser(uid: string) {
        return this.storage
            .ref(`avatars/${uid}/avatar.jpg`)
            .getDownloadURL()
            .pipe(
                catchError((error) => {
                    throw error;
                }),
            );
    }

    uploadUserAvatar(uid: string, avatar: File) {
        return this.storage
            .upload(`avatars/${uid}/`, avatar)
            .snapshotChanges()
            .pipe(
                catchError((error) => {
                    throw error;
                }),
            );
    }

    getCurrentUser(): Observable<UserData | undefined> {
        return this.user$;
    }
}
