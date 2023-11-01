import { Component, OnInit } from '@angular/core';
import { LanguageService } from '@app/services/language-service/languag.service';
import { UserService } from '@app/services/user-service/user.service';
import { take } from 'rxjs';

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
        });
        this.userService
            .getUserLang()
            .pipe(take(1))
            .subscribe((lang) => {
                this.langService.setAppLanguage(lang as string);
            });
    }
}
