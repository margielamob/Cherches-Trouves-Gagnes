import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private afAuth: AngularFireAuth, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map((user) => {
                if (!user) {
                    this.router.navigate(['/login']);
                    return false;
                    // if user is registred but not verified
                } else if (!user.emailVerified) {
                    this.router.navigate(['/verify-email']);
                    return false;
                }

                return true;
            }),
        );
    }
}
