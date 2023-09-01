import { Component } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { Theme } from '@app/enums/theme';

@Component({
    selector: 'app-no-game-snackbar',
    templateUrl: './no-game-snackbar.component.html',
    styleUrls: ['./no-game-snackbar.component.scss'],
})
export class NoGameSnackbarComponent {
    theme: typeof Theme = Theme;

    constructor(public snackBarRef: MatSnackBarRef<NoGameSnackbarComponent>) {}
}
