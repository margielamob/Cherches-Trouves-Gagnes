import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { SessionHandlerService } from '@app/services/session-handler/session-handler.service';
import { UserService } from '@app/services/user-service/user.service';
import { catchError, from, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    // eslint-disable-next-line max-params
    constructor(
        private afAuth: AngularFireAuth,
        private userService: UserService,
        private sessionHandlerService: SessionHandlerService,
        private router: Router,
    ) {}

    login(email: string, password: string) {
        // login user with email and password
        return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
            tap((response) => {
                // Ceci est un effet secondaire, il ne modifie pas la sortie de l'observable
                if (response.user) this.sessionHandlerService.logSessionActivity(response.user.uid, 'conect').subscribe();
            }),
            catchError((error: FirebaseError) => {
                if (error.code === 'auth/user-not-found') {
                    return throwError(() => new Error("Votre compte n'existe pas. Veuillez vous inscrire ou verifier vos informations"));
                } else if (error.code === 'auth/wrong-password') {
                    return throwError(() => new Error('votre mot de passe est incorrecte.'));
                } else {
                    return throwError(() => new Error('Une erreur est survenue lors de la connexion. Merci de revenir plus tard.'));
                }
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
                    // Ceci est un effet secondaire, il ne modifie pas la sortie de l'observable
                    if (user) this.sessionHandlerService.logSessionActivity(user.uid, 'disconect').subscribe();
                }),
                switchMap((user) => {
                    if (user) {
                        return this.sessionHandlerService.deleteSession(user.uid);
                    } else {
                        return of(null);
                    }
                }),
            )
            .pipe(take(1))
            .subscribe(() => {
                // sign out user
                setTimeout(() => {
                    this.afAuth.signOut();
                }, 100000);
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
}
