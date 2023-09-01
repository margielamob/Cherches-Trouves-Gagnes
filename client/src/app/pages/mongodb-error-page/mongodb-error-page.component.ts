import { Component } from '@angular/core';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-mongodb-error-page',
    templateUrl: './mongodb-error-page.component.html',
    styleUrls: ['./mongodb-error-page.component.scss'],
})
export class MongodbErrorPageComponent {
    favoriteTheme: string = Theme.ClassName;
}
