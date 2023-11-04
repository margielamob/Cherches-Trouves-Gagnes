/* eslint-disable max-params */
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogConfirmResetPasswordComponent } from '@app/components/dialog-confirm-reset-password/dialog-confirm-reset-password.component';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
    resetPasswordForm: FormGroup;
    errorMessage = '';

    constructor(private fb: FormBuilder, private authService: AuthenticationService, public dialog: MatDialog, private route: Router) {
        this.resetPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    get email() {
        return this.resetPasswordForm.get('email');
    }

    submitResetPassword() {
        if (this.resetPasswordForm.valid) {
            const email = this.resetPasswordForm.value.email;
            this.authService.sendPasswordResetEmail(email).subscribe({
                next: () => {
                    this.dialog.open(DialogConfirmResetPasswordComponent);
                },
                error: (error) => {
                    this.errorMessage = error.message;
                },
            });
        }
    }

    cancel() {
        this.route.navigate(['/login']);
    }
}
