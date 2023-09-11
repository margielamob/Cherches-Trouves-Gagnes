import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { UserService } from '../user-service/user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    constructor(private afAuth: AngularFireAuth, private userService: UserService) {}

    login(email: string, password: string) {
        // login user with email and password
        return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
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
                // Si l'adresse e-mail est déjà utilisée
                if (error.code === 'auth/email-already-in-use') {
                    return throwError(() => new Error("L'adresse e-mail est déjà utilisée. Connecter vous a votre compte"));
                } else {
                    return throwError(() => new Error("Une erreur est survenue lors de l'inscription. Merci de revenir plus tard."));
                }
            }),
        );
    }

    logout() {
        //logout currunt user . A utuliser plus tard
        return from(this.afAuth.signOut());
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
                // l'utilisateur n'existe pas
                return throwError(() => new Error("Nom d'utilisateur introuvable."));
            }),
        );
    }
}
