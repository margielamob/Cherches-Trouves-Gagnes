import { Component } from '@angular/core';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent {
    favoriteTheme = Theme.ClassName;
}
