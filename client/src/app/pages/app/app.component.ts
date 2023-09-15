import { Component, OnInit } from '@angular/core';
import { Theme } from '@app/enums/theme';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    favoriteTheme: string = Theme.ClassName;

    constructor(private auth: AuthenticationService) {}
    ngOnInit(): void {
        if (localStorage.getItem('isLoadedBefore')) {
            this.auth.signOut();
        } else {
            localStorage.setItem('isLoadedBefore', 'true');
        }
    }
}
