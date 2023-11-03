import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserService } from '@app/services/user-service/user.service';
import { catchError, from, of, switchMap, take, tap, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    // eslint-disable-next-line max-params
    constructor(private afAuth: AngularFireAuth, private userService: UserService, private router: Router, private afs: AngularFirestore) {}

    login(email: string, password: string) {
        // login user with email and password
        return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
            switchMap((response) => {
                const user = response.user;

                if (!user) {
                    throw new Error('Echec de la connexion.');
                }

                // Generate new session token
                const token = uuidv4();
                const timeStamp = new Date();
                const deviceInfo = navigator.userAgent;
                localStorage.setItem('sessionToken', token);

                // Creat session document in firestore
                return from(
                    this.afs.doc(`session/${user.uid}`).set({
                        token,
                        timeStamp,
                        deviceInfo,
                    }),
                ).pipe(tap(() => this.logSessionActivity(user.uid, 'connect').subscribe()));
            }),
            // error handling
            catchError((error: FirebaseError) => {
                let errorMessage = 'Une erreur est survenue lors de la connexion. Merci de revenir plus tard.';

                if (error.code === 'auth/user-not-found') {
                    errorMessage = "Votre compte n'existe pas. Veuillez vous inscrire ou vérifier vos informations.";
                } else if (error.code === 'auth/wrong-password') {
                    errorMessage = 'Votre mot de passe est incorrect.';
                }

                return throwError(() => new Error(errorMessage));
            }),
        );
    }

    signUp(email: string, password: string) {
        return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
            catchError((error: FirebaseError) => {
                // if email adress is already used
                if (error.code === 'auth/email-already-in-use') {
                    return throwError(() => new Error("L'adresse e-mail est déjà utilisée. Connecter vous a votre compte"));
                } else {
                    return throwError(() => new Error("Une erreur est survenue lors de l'inscription. Merci de revenir plus tard."));
                }
            }),
        );
    }

    signOut() {
        this.afAuth.authState
            .pipe(
                tap((user) => {
                    // log information about the session activity
                    if (user) this.logSessionActivity(user.uid, 'disconect').subscribe();
                }),
            )
            .pipe(take(1))
            .subscribe(() => {
                // sign out user

                this.afAuth.signOut();

                localStorage.removeItem('sessionToken');
                this.router.navigate(['login']);
            });
    }

    loginWithUserName(credential: string, password: string, isEmail: boolean) {
        if (isEmail) {
            return this.login(credential, password);
        }
        return this.userService.getUserByUserName(credential).pipe(
            switchMap((user) => {
                if (user) {
                    return this.login(user?.email, password);
                }
                // user not found
                return throwError(() => new Error("Nom d'utilisateur introuvable."));
            }),
        );
    }

    // check if session token is the same as the one in firestore, if not, sign out user

    // checkSession(): Observable<boolean | undefined> {
    //     return this.afAuth.user.pipe(
    //         switchMap((user) => {
    //             if (user) {
    //                 const deviceToken = localStorage.getItem('sessionToken');
    //                 return this.afs
    //                     .doc<Session>(`session/${user.uid}`)
    //                     .valueChanges()
    //                     .pipe(
    //                         tap((sessionData: Session | undefined) => {
    //                             if (sessionData?.token !== deviceToken) {
    //                                 this.signOut();
    //                             }
    //                         }),
    //                         map((sessionData: Session | undefined) => sessionData?.token === deviceToken),
    //                     );
    //             }
    //             return of(false);
    //         }),
    //     );
    // }

    // listen to session changes, if session token is not the same as the one in firestore, sign out user, else do nothing

    // listenToSessionChanges() {
    //     this.afAuth.user
    //         .pipe(
    //             switchMap((user) => {
    //                 if (user) {
    //                     return this.afs
    //                         .doc<Session>(`session/${user.uid}`)
    //                         .valueChanges()
    //                         .pipe(
    //                             tap((sessionData) => {
    //                                 const deviceToken = localStorage.getItem('sessionToken');
    //                                 if (sessionData?.token !== deviceToken) {
    //                                     this.signOut();
    //                                 }
    //                             }),
    //                         );
    //                 }
    //                 return of(null);
    //             }),
    //         )
    //         .subscribe();
    // }

    // log session activity in firestore for each user
    logSessionActivity(userUid: string, activity: string) {
        const log = {
            activity,
            timestamp: new Date(),
        };
        return from(this.afs.collection('users').doc(userUid).collection('activityLogs').add(log));
    }

    sendEmailVerification() {
        return from(this.afAuth.currentUser).pipe(
            switchMap((user) => {
                // send email verification if user is not verified
                if (user && !user.emailVerified) {
                    return from(user.sendEmailVerification());
                }
                // else return null
                return of(null);
            }),
            catchError((err) => {
                throw err;
            }),
        );
    }

    deleteAccount() {
        return from(this.afAuth.currentUser).pipe(
            switchMap((user) => {
                if (user) {
                    const uid = user.uid;

                    // Signout User
                    return from(this.afAuth.signOut()).pipe(
                        switchMap(() => {
                            // delete user from Firebase Authentication
                            return from(user.delete()).pipe(
                                switchMap(() => {
                                    // delete user from Firestore
                                    return this.userService.deleteUser(uid);
                                }),
                                catchError((error) => {
                                    throw error;
                                }),
                            );
                        }),
                    );
                }
                return of(null);
            }),
        );
    }
}
