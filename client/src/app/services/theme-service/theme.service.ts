import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    appTheme: string = 'Default';
    setappTheme(theme: string): void {
        this.appTheme = theme;
    }
}
