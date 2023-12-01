import { Component, Input } from '@angular/core';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
    @Input() headerMessage: string;
    @Input() isHomeButtonEnabled: boolean = true;
    @Input() isExitButtonEnabled: boolean = false;
    @Input() isSignOutButtonEnabled: boolean = true;
    @Input() isAvatarEnabled: boolean = true;

    constructor(private authService: AuthenticationService) {}

    signOut() {
        // Logout function
        this.authService.signOut();
    }
}
