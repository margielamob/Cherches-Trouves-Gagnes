import { Component, OnInit } from '@angular/core';
import { LanguageService } from '@app/services/language-service/language-service.service';
import { UserService } from '@app/services/user-service/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    currentTheme: string = 'default';
    isLoadingData = true;

    constructor(private langService: LanguageService, public userService: UserService) {}
    ngOnInit(): void {
        this.langService.setDefaultLanguage();
        console.log('Langue courante app :', this.langService.getLanguage());
        this.userService.getUserTheme().subscribe((theme) => {
            this.currentTheme = theme as string;
            console.log('Theme courant app :', this.currentTheme);
            this.isLoadingData = false;
        });
    }
}
