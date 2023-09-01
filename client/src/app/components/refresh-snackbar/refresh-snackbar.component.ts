import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-refresh-snackbar',
    templateUrl: './refresh-snackbar.component.html',
    styleUrls: ['./refresh-snackbar.component.scss'],
})
export class RefreshSnackbarComponent {
    theme: typeof Theme = Theme;
    constructor(public snackBarRef: MatSnackBarRef<RefreshSnackbarComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: unknown) {}
}
