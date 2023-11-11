import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    appTheme: string = 'Default';
    setAppTheme(theme: string): void {
        this.appTheme = theme;
    }
    getAppTheme(): string {
        return this.appTheme;
    }
}
