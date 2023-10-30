import { Component, OnInit } from '@angular/core';
import { LanguageService } from '@app/services/language-service/language-service.service';
import { ThemeService } from '@app/services/theme-service/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    favoriteTheme: string = this.themeService.curruntTheme;
    constructor(private langService: LanguageService, public themeService: ThemeService) {}
    ngOnInit(): void {
        this.langService.setDefaultLanguage();
        console.log('Langue courante app :', this.langService.getLanguage());

        // listen to session changes
        // this.auth.listenToSessionChanges();
    }
}
