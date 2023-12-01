import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from '@app/interfaces/user';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';
import { UserService } from '@app/services/user-service/user.service';
import { from, switchMap, take, throwError } from 'rxjs';
import { userNameValidator } from 'utils/custom-validators';

const PASSWORD_MIN_LENGTH = 6;

@Component({
    selector: 'app-sign-up-page',
    templateUrl: './sign-up-page.component.html',
    styleUrls: ['./sign-up-page.component.scss'],
})
export class SignUpPageComponent {
    signUpForm: FormGroup;
    errorMessage: string = '';

    constructor(private router: Router, private userService: UserService, private auth: AuthenticationService) {
        this.signUpForm = new FormGroup({
            username: new FormControl(
                '',
                [Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$')],
                [userNameValidator(this.userService)],
            ),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)]),
        });
    }

    get email() {
        return this.signUpForm.get('email');
    }

    get password() {
        return this.signUpForm.get('password');
    }

    get username() {
        return this.signUpForm.get('username');
    }

    goToLoginPage() {
        this.router.navigate(['/login']);
    }

    submit() {
        if (!this.signUpForm.valid) {
            return;
        }

        const { username, email, password } = this.signUpForm.value;
        this.auth
            .signUp(email, password)
            .pipe(
                switchMap((credential) => {
                    const user: UserData = {
                        displayName: username as string,
                        email: credential.user?.email as string,
                        photoURL: 'assets/default-user-icon.jpg',
                        uid: credential.user?.uid as string,
                        phoneNumber: '',
                        // Set default user configurations
                        theme: 'Default',
                        language: 'Fr',
                        numberDifferenceFound: 0,
                        totalTimePlayed: 0,
                        gameWins: 0,
                        gamePlayed: 0,
                        friends: [],
                    };
                    return this.userService.adduser(user).pipe(
                        switchMap(() => {
                            return from(
                                // send email verification after refister the user
                                credential.user?.sendEmailVerification() ??
                                    throwError(() => new Error("Impossible d'envoyer le courriel de vérification.")),
                            );
                        }),
                    );
                }),
            )
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.router.navigate(['/verify-email']);
                },
                error: (error: Error) => {
                    this.errorMessage = error.message;
                },
            });
    }
}
