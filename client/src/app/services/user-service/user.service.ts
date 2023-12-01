/* eslint-disable no-console */
/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UserData } from '@app/interfaces/user';
import { Observable, catchError, forkJoin, from, map, of, switchMap, take, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    activeUser: UserData;
    user$: Observable<UserData | undefined>;
    constructor(
        private afs: AngularFirestore,
        private storage: AngularFireStorage,
        private afAuth: AngularFireAuth, // private chatManager: ChatManagerService,
    ) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap((user) => {
                if (user) {
                    return this.afs.collection('users').doc<UserData>(user.uid).valueChanges();
                } else {
                    return of(undefined);
                }
            }),
        );
        this.user$.subscribe((user) => {
            if (user) {
                this.activeUser = user;
            }
        });
    }

    adduser(user: UserData) {
        return from(this.afs.collection('users').doc(user.uid).set(user));
    }

    deleteUser(userUid: string) {
        return from(this.afs.collection('users').doc(userUid).delete());
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

    updateUserByID(userID: string) {
        return from(this.afs.collection('users').doc(userID).update({}));
    }

    doesUserAvatarExist(uid: string): Observable<boolean> {
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

    getImageOfSignedUser(path: string | undefined): Observable<string> {
        return this.storage
            .ref(`${path}`)
            .getDownloadURL()
            .pipe(
                catchError((error) => {
                    throw error;
                }),
            );
    }

    getAvatarOfSignedUser(uid: string): Observable<string> {
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

    updateUserAvatar(userID: string, photoURL: string) {
        return from(this.afs.collection('users').doc(userID).update({ photoURL })).pipe(
            catchError((error) => {
                throw error;
            }),
        );
    }

    getCurrentUser(): Observable<UserData | undefined> {
        return this.user$;
    }

    getCurrentUserUsername(): Observable<string | null> {
        return this.user$.pipe(
            switchMap((userData) => {
                if (userData) {
                    return of(userData.displayName);
                } else {
                    return of(null);
                }
            }),
        );
    }

    getUserLang(): Observable<string | null> {
        return this.user$.pipe(
            switchMap((user) => {
                if (user && user.language !== undefined) {
                    return of(user.language);
                } else {
                    return of(null);
                }
            }),
        );
    }

    getUserTheme(): Observable<string | null> {
        return this.user$.pipe(
            switchMap((user) => {
                if (user && user.theme !== undefined) {
                    return of(user.theme);
                } else {
                    return of('Default');
                }
            }),
        );
    }

    getUserEmail(): Observable<string | null> {
        return this.user$.pipe(
            switchMap((user) => {
                if (user && user.email !== undefined) {
                    return of(user.email);
                } else {
                    return of(null);
                }
            }),
        );
    }

    setUserTheme(theme: string): Observable<void> {
        return this.user$.pipe(
            take(1),
            switchMap((user) => {
                if (!user) {
                    return of(undefined); // Ou gestion d'erreur appropriée
                }
                const userId = user.uid;
                const userRef = this.afs.collection('users').doc(userId);
                return from(userRef.update({ theme }));
            }),
        );
    }

    setUserLang(language: string): Observable<void> {
        return this.user$.pipe(
            take(1),
            switchMap((user) => {
                if (!user) {
                    return of(undefined);
                }
                const userId = user.uid;
                const userRef = this.afs.collection('users').doc(userId);
                return from(userRef.update({ language }));
            }),
        );
    }

    getUserLangue(): Observable<string | null> {
        return this.user$.pipe(
            switchMap((user) => {
                if (user && user.language !== undefined) {
                    return of(user.language);
                } else {
                    return of(null);
                }
            }),
        );
    }

    getUserGameWin(): Observable<number | null> {
        return this.user$.pipe(
            switchMap((user) => {
                if (user && user.gameWins !== undefined) {
                    return of(user.gameWins);
                } else {
                    return of(null);
                }
            }),
        );
    }

    updateUserGameWin() {
        this.getUserGameWin()
            .pipe(take(1))
            .subscribe((gameWin) => {
                if (gameWin !== null) {
                    this.user$.pipe(take(1)).subscribe((user) => {
                        if (user && user.uid) {
                            const userId = user.uid;
                            const userRef = this.afs.collection('users').doc(userId);
                            userRef.update({ gameWins: gameWin + 1 });
                        }
                    });
                }
            });
    }

    getUserGamePlayed(): Observable<number | null> {
        return this.user$.pipe(
            switchMap((user) => {
                if (user && user.gamePlayed !== undefined) {
                    return of(user.gamePlayed);
                } else {
                    return of(null);
                }
            }),
        );
    }

    updateUserGamePlayed() {
        this.getUserGamePlayed()
            .pipe(take(1))
            .subscribe((gamePlayed) => {
                if (gamePlayed !== null) {
                    this.user$.pipe(take(1)).subscribe((user) => {
                        if (user && user.uid) {
                            const userId = user.uid;
                            const userRef = this.afs.collection('users').doc(userId);
                            userRef.update({ gamePlayed: gamePlayed + 1 });
                        }
                    });
                }
            });
    }

    getNbDifferenceFound() {
        return this.user$.pipe(
            switchMap((user) => {
                if (user && user.numberDifferenceFound !== undefined) {
                    return of(user.numberDifferenceFound);
                } else {
                    return of(null);
                }
            }),
        );
    }

    updateNbDifferenceFound(playerName: string) {
        this.getNbDifferenceFound()
            .pipe(take(1))
            .subscribe((numberDifferenceFound) => {
                if (numberDifferenceFound !== null) {
                    this.user$.pipe(take(1)).subscribe((user) => {
                        if (user && user.uid) {
                            const userId = user.uid;
                            const userRef = this.afs.collection('users').doc(userId);
                            if (playerName === user.displayName) {
                                userRef.update({ numberDifferenceFound: numberDifferenceFound + 1 });
                            }
                        }
                    });
                }
            });
    }

    getTotalTimePlayed() {
        return this.user$.pipe(
            switchMap((user) => {
                if (user && user.totalTimePlayed !== undefined) {
                    return of(user.totalTimePlayed);
                } else {
                    return of(null);
                }
            }),
        );
    }

    updateTotalTimePlayed(timePlayed: number) {
        if (isNaN(timePlayed)) {
            return;
        }
        this.getTotalTimePlayed()
            .pipe(take(1))
            .subscribe((totalTimePlayed) => {
                if (totalTimePlayed !== null) {
                    this.user$.pipe(take(1)).subscribe((user) => {
                        if (user && user.uid) {
                            const userId = user.uid;
                            const userRef = this.afs.collection('users').doc(userId);
                            userRef.update({ totalTimePlayed: totalTimePlayed + timePlayed });
                        }
                    });
                }
            });
    }

    changeUserDisplayName(newDisplayName: string): Observable<void> {
        return this.getCurrentUser().pipe(
            take(1),
            switchMap((user) => {
                if (!user || !user.uid) {
                    throw new Error('Aucun utilisateur connecté ou UID non disponible');
                }
                return from(this.afs.collection('users').doc(user.uid).update({ displayName: newDisplayName }));
            }),
        );
    }

    addToActiveUser(userId: string): Observable<void> {
        return from(this.afs.collection('activeUsers').doc(userId).set({ userId })).pipe(
            catchError(() => {
                return throwError(() => new Error("Erreur lors de l'ajout de l'utilisateur aux utilisateurs actifs"));
            }),
        );
    }

    deleteFromActiveUser(): Observable<void> {
        return this.user$.pipe(
            take(1),
            switchMap((user) => {
                if (user && user.uid) {
                    return from(this.afs.collection('activeUsers').doc(user.uid).delete());
                } else {
                    return throwError(() => new Error('No user logged in or UID not available'));
                }
            }),
            catchError(() => {
                return throwError(() => new Error('Error removing user from active users'));
            }),
        );
    }

    getFriends(): Observable<UserData[]> {
        return this.user$.pipe(
            switchMap((user) => {
                if (user && user.friends && user.friends.length > 0) {
                    return this.afs.collection<UserData>('users', (ref) => ref.where('uid', 'in', user.friends)).valueChanges({ idField: 'uid' });
                } else {
                    return of([]);
                }
            }),
        );
    }

    deleteFriend(currentUserUid: string, friendUid: string): Observable<unknown> {
        const currentUserDocRef = this.afs.doc<UserData>(`users/${currentUserUid}`);
        const friendDocRef = this.afs.doc<UserData>(`users/${friendUid}`);

        return forkJoin({
            currentUser: currentUserDocRef.valueChanges().pipe(take(1)),
            friendUser: friendDocRef.valueChanges().pipe(take(1)),
        }).pipe(
            switchMap(({ currentUser, friendUser }) => {
                const updatedCurrentUserFriendsList = currentUser?.friends?.filter((id) => id !== friendUid) || [];

                const updatedFriendFriendsList = friendUser?.friends?.filter((id) => id !== currentUserUid) || [];

                return forkJoin({
                    currentUserUpdate: from(currentUserDocRef.update({ friends: updatedCurrentUserFriendsList })),
                    friendUpdate: from(friendDocRef.update({ friends: updatedFriendFriendsList })),
                });
            }),
        );
    }
}
