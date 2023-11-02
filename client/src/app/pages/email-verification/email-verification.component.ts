import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';
import { UserService } from '@app/services/user-service/user.service';

@Component({
    selector: 'app-email-verification',
    templateUrl: './email-verification.component.html',
    styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
    userEmail: string = '';
    constructor(private auth: AuthenticationService, private router: Router, private userService: UserService) {}
    ngOnInit(): void {
        this.userService.getUserEmail().subscribe((email) => (this.userEmail = email as string));
    }

    sendEmailVerification() {
        this.auth.sendEmailVerification().subscribe(() => alert('E-mail de vérification envoyé!'));
    }

    goToLoginPage() {
        this.router.navigate(['/login']);
    }
}
