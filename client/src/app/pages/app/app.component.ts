import { Component, OnInit } from '@angular/core';
import { LanguageService } from '@app/services/language-service/languag.service';
import { UserService } from '@app/services/user-service/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    currentTheme: string = 'default';

    constructor(private langService: LanguageService, public userService: UserService) {}
    ngOnInit(): void {
        this.userService.getUserTheme().subscribe((theme) => {
            this.currentTheme = theme as string;
            console.log('Theme courant app :', this.currentTheme);
        });
        this.userService.getUserLang().subscribe((lang) => {
            this.langService.setAppLanguage(lang as string);
        });
    }
}
