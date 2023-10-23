import { Component, OnInit } from '@angular/core';
import { Theme } from '@app/enums/theme';
import { AuthenticationService } from '@app/services/authentication-service/authentication.service';
import { LanguageService } from '@app/services/language-service/language-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    favoriteTheme: string = Theme.ClassName;

    constructor(private auth: AuthenticationService, private langService: LanguageService) {}
    ngOnInit(): void {
        this.langService.setDefaultLanguage();
        console.log('Langue courante app :', this.langService.currunetLanguage);
        // listen to session changes
        this.auth.listenToSessionChanges();

        // i'm not using this for now, but i'll keep it here just in case

        // // automaticly sign out user when page is closed
        // const closeTabEvent = fromEvent(window, 'beforeunload');

        // closeTabEvent
        //     .pipe(takeUntil(closeTabEvent))
        //     .pipe(take(1))
        //     .subscribe(() => {
        //         this.auth.signOut();
        //     });

        // automaticly sign out user when page is reloaded

        // if (localStorage.getItem('isLoadedBefore')) {
        //     this.auth.signOut();
        // } else {
        //     localStorage.setItem('isLoadedBefore', 'true');
        // }
    }
}
