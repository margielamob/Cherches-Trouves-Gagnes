import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SessionGuard implements CanActivate {
    constructor(private afAuth: AngularFireAuth, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            take(1),
            map((user) => {
                const isAuth = !!user;
                if (isAuth) {
                    this.router.navigate(['/home']);
                    return false;
                }
                return true;
            }),
        );
    }
}
