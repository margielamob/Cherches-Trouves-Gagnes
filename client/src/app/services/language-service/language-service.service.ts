import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    currunetLanguage: string;
    constructor(private translateService: TranslateService) {}

    setDefaultLanguage() {
        this.translateService.setDefaultLang('Fr');
        this.translateService.use('Fr');
        this.currunetLanguage = this.translateService.currentLang;
    }

    setlanguage(language: string) {
        if (language === this.translateService.currentLang) return;
        this.translateService.use(language);
        this.currunetLanguage = this.translateService.currentLang;
    }
}
