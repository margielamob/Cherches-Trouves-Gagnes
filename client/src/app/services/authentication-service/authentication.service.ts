import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserService } from '@app/services/user-service/user.service';
import { catchError, from, of, switchMap, take, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    // eslint-disable-next-line max-params
    constructor(private afAuth: AngularFireAuth, private userService: UserService, private router: Router, private afs: AngularFirestore) {}

    login(email: string, password: string) {
        const MAX_ATTEMPTS = 3;
        const attemptsKey = `login_attempts_${email}`;
        const userAttempts = parseInt(localStorage.getItem(attemptsKey) || '0', 10);
        if (userAttempts >= MAX_ATTEMPTS) {
            return throwError(() => new Error('Compte bloqué après 3 tentatives infructueuses.'));
        }

        return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
            switchMap((response) => {
                const user = response.user;
                if (!user) {
                    throw new Error('Echec de la connexion.');
                }

                // Réinitialiser les tentatives à 0 dans le localStorage après une connexion réussie
                localStorage.setItem(attemptsKey, '0');

                return this.afs
                    .collection('activeUsers')
                    .doc(user.uid)
                    .get()
                    .pipe(
                        switchMap((doc) => {
                            if (doc.exists) {
                                return this.afAuth.signOut().then(() => {
                                    throw new Error('Vous avez déjà une session ouverte sur un autre client, veuillez vous déconnecter');
                                });
                            }
                            return this.userService.addToActiveUser(user.uid);
                        }),
                        switchMap(() => {
                            return this.logSessionActivity(user.uid, 'connect');
                        }),
                    );
            }),
            catchError((error: FirebaseError | Error) => {
                let errorMessage = 'Vous avez déjà une session ouverte sur un autre client, veuillez vous déconnecter';

                if (error instanceof FirebaseError && error.code === 'auth/wrong-password') {
                    let attempts = parseInt(localStorage.getItem(attemptsKey) || '0', 10);
                    attempts++;
                    localStorage.setItem(attemptsKey, attempts.toString());

                    if (attempts >= MAX_ATTEMPTS) {
                        errorMessage = 'Compte bloqué après 3 tentatives infructueuses.';
                    } else {
                        errorMessage = 'Votre mot de passe est incorrect.';
                    }
                } else if (error instanceof FirebaseError && error.code === 'auth/user-not-found') {
                    errorMessage = "Votre compte n'existe pas. Veuillez vous inscrire ou vérifier vos informations.";
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

    signOut(): void {
        this.userService.user$
            .pipe(
                take(1),
                switchMap((user) => {
                    if (user) {
                        return this.logSessionActivity(user.uid, 'disconnect').pipe(switchMap(() => this.userService.deleteFromActiveUser()));
                    } else {
                        return of(null);
                    }
                }),
                switchMap(async () => this.afAuth.signOut()),
                catchError(() => {
                    return of("Erreur lors de la déconnexion, la session n'est pas supprimée sur Firebase.");
                }),
            )
            .subscribe({
                next: () => {
                    this.router.navigate(['login']);
                },
                error: (error) => {
                    throw error;
                },
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

    // log session activity in firestore for each user
    logSessionActivity(userUid: string, activity: string) {
        const log = {
            activity,
            client: 'desktop',
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

    sendPasswordResetEmail(email: string) {
        return from(this.afAuth.sendPasswordResetEmail(email)).pipe(
            catchError((error: FirebaseError) => {
                // Handle errors here
                let errorMessage = 'Une errerur est survenue lors de la réinitialisation du mot de passe. Merci de réessayer plus tard.';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = "Aucun compte n'est associé à cette adresse e-mail. Veuillez vérifier vos informations.";
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Email address is invalid.';
                }

                return throwError(() => new Error(errorMessage));
            }),
        );
    }
}
