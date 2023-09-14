import { Component } from '@angular/core';
import { Theme } from '@app/enums/theme';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    favoriteTheme: string = Theme.Alternative;

    constructor(private translate: TranslateService) {
        this.translate.setDefaultLang('en');
    }
}
