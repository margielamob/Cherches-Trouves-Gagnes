import { Injectable } from '@angular/core';
import { Theme } from '@app/enums/theme';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    curruntTheme: string = Theme.Default;

    setTheme(theme: string) {
        this.curruntTheme = theme;
    }
    getCurruntTheme() {
        return this.curruntTheme;
    }
}
