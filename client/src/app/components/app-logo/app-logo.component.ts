import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@app/services/user-service/user.service';
import { Subject, Subscription, combineLatest, takeUntil } from 'rxjs';

@Component({
    selector: 'app-game-logo',
    templateUrl: './app-logo.component.html',
    styleUrls: ['./app-logo.component.scss'],
})
export class AppLogoComponent implements OnInit, OnDestroy {
    userThemeSubscription: Subscription;
    imgSrc: string = 'assets/quote_d.png';
    currentLanguage: string;
    currentTheme: string;
    private unsubscribe$ = new Subject<void>();

    constructor(public userService: UserService) {}
    ngOnInit(): void {
        combineLatest([this.userService.getUserLang(), this.userService.getUserTheme()])
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(([lang, theme]) => {
                this.currentLanguage = lang || 'Fr';
                this.currentTheme = theme || 'Default';
                this.updateImageSource(this.currentTheme, this.currentLanguage);
            });
    }

    updateImageSource(theme: string, lang: string): void {
        if (theme === 'Alternative' && lang === 'Fr') {
            this.imgSrc = 'assets/quote.png';
        } else if (theme === 'Alternative' && lang === 'En') {
            this.imgSrc = 'assets/search_find_win_prp.jpg';
        } else if (theme === 'Default' && lang === 'Fr') {
            this.imgSrc = 'assets/quote_d.png';
        } else if (theme === 'Default' && lang === 'En') {
            this.imgSrc = 'assets/search_find_win_blue.jpg';
        } else {
            this.imgSrc = 'assets/quote_d.png';
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
