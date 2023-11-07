import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@app/services/user-service/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
    userThemeSubscription: Subscription;
    currentTheme: string;
    constructor(public userService: UserService) {}

    ngOnInit(): void {
        this.userThemeSubscription = this.userService.getUserTheme().subscribe((theme) => {
            this.currentTheme = theme as string;
        });
    }

    ngOnDestroy(): void {
        if (this.userThemeSubscription) {
            this.userThemeSubscription.unsubscribe();
        }
    }
}
