import { Component } from '@angular/core';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    favoriteTheme: string = Theme.ClassName;
}
