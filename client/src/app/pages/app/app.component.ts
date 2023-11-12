import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from '@app/services/language-service/languag.service';
import { ThemeService } from '@app/services/theme-service/theme.service';
import { UserService } from '@app/services/user-service/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    currentTheme: string = 'default';
    userThemeSubscription: Subscription;
    userLangSubscription: Subscription;

    constructor(private langService: LanguageService, public userService: UserService, private themeService: ThemeService) {}
    ngOnInit(): void {
        this.userThemeSubscription = this.userService.getUserTheme().subscribe((theme) => {
            this.currentTheme = theme as string;
            this.themeService.setAppTheme(theme as string);
        });
        this.userLangSubscription = this.userService
            .getUserLang()

            .subscribe((lang) => {
                this.langService.setAppLanguage(lang as string);
            });
    }

    ngOnDestroy(): void {
        if (this.userThemeSubscription) {
            this.userThemeSubscription.unsubscribe();
        }
        if (this.userLangSubscription) {
            this.userLangSubscription.unsubscribe();
        }
    }
}
