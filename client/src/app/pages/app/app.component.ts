import { Component } from '@angular/core';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    favoriteTheme: string = Theme.ClassName;
}
