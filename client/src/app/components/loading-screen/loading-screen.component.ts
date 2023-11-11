import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@app/services/theme-service/theme.service';
import { UserService } from '@app/services/user-service/user.service';

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent implements OnInit {
    currentTheme: string;
    constructor(public userService: UserService, private themeService: ThemeService) {}

    ngOnInit(): void {
        this.currentTheme = this.themeService.getAppTheme();
    }
}
