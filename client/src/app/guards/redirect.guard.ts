import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RedirectIfAuthenticatedGuard implements CanActivate {
    constructor(private afAuth: AngularFireAuth, private router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this.afAuth.authState.pipe(
            take(1),
            map((user) => {
                if (user) {
                    this.router.navigate(['/home']);
                    return false;
                }
                return true;
            }),
        );
    }
}
