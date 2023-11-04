import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    currunetLanguage: string = '';
    constructor(private translateService: TranslateService) {}

    setAppLanguage(lang: string) {
        if (!lang) lang = 'Fr';
        this.translateService.setDefaultLang(lang);
        this.translateService.use(lang);
        this.setCurrentLanguage(lang);
    }

    setCurrentLanguage(lang: string) {
        this.currunetLanguage = lang;
    }

    getCurrentLanguage() {
        return this.currunetLanguage;
    }
}
