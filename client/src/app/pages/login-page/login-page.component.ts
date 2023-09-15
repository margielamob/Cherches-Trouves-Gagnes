import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';
import { SessionHandlerService } from '@app/services/session-handler/session-handler.service';
import { map, switchMap, take, throwError } from 'rxjs';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
    loginForm: FormGroup;
    errorMessage: string = '';

    constructor(private auth: AuthenticationService, private router: Router, private sessionhandler: SessionHandlerService) {
        this.loginForm = new FormGroup({
            credential: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }
    get credential() {
        return this.loginForm.get('credential');
    }

    get password() {
        return this.loginForm.get('password');
    }

    submit() {
        if (!this.loginForm.valid) {
            return;
        }

        const { credential, password } = this.loginForm.value;
        const credentialValue: string = this.credential?.value;
        const isEmail: boolean = credentialValue.includes('@');

        this.auth
            .loginWithUserName(credential, password, isEmail)
            .pipe(
                switchMap((credentials) => {
                    return this.sessionhandler
                        .checkIfSessionExists(credentials.user?.uid as string)
                        .pipe(map((sessionExists) => ({ credentials, sessionExists })));
                }),
                switchMap(({ credentials, sessionExists }) => {
                    if (!sessionExists) {
                        return this.sessionhandler.addSession(credentials.user?.uid as string);
                    } else {
                        return throwError(() => new Error('Une session est déjà active pour cet utilisateur.'));
                    }
                }),
                take(1),
            )
            .subscribe({
                next: () => {
                    this.router.navigate(['home']);
                },
                error: (error: Error) => {
                    this.errorMessage = error.message;
                },
            });
    }

    goToSignUpPage() {
        this.router.navigate(['/sign-up']);
    }
}
