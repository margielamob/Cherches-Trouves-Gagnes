import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';

@Component({
    selector: 'app-email-verification',
    templateUrl: './email-verification.component.html',
    styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent {
    constructor(private auth: AuthenticationService, private router: Router) {}

    sendEmailVerification() {
        this.auth.sendEmailVerification().subscribe(() => alert('E-mail de vérification envoyé!'));
    }

    goToLoginPage() {
        this.router.navigate(['/login']);
    }
}
