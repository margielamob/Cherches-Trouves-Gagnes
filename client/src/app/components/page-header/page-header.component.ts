import { Component, Input, OnInit } from '@angular/core';
import { UserData } from '@app/interfaces/user';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';
import { UserService } from '@app/services/user-service/user.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {
    @Input() headerMessage: string;
    @Input() isHomeButtonEnabled: boolean = true;
    @Input() isExitButtonEnabled: boolean = false;
    user$: Observable<UserData | undefined>;

    constructor(private userService: UserService, private authenticationService: AuthenticationService) {}

    ngOnInit(): void {
        this.user$ = this.userService.getCurrentUser();
    }

    logout(): void {
        this.authenticationService.logout();
    }
}
