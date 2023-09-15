import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private afAuth: AngularFireAuth, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map((user) => !!user),
            tap((isAuthenticated) => {
                if (!isAuthenticated) {
                    this.router.navigate(['/login']);
                }
            }),
        );
    }
}
