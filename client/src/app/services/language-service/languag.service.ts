import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    currunetLanguage: string = '';
    constructor(private translateService: TranslateService) {}

    setAppLanguage(lang: string) {
        if (!lang) this.currunetLanguage = 'Fr';
        this.translateService.setDefaultLang(lang);
        this.translateService.use(lang);
        this.setCurrentLanguage(lang);
        console.log('langService', this.currunetLanguage);
    }

    setCurrentLanguage(lang: string) {
        console.log('langue courante :', lang);
        this.currunetLanguage = lang;
    }

    getCurrentLanguage() {
        return this.currunetLanguage;
    }
}
