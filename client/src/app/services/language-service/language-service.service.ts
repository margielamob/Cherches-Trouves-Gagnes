import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    currunetLanguage: string = 'Fr';
    constructor(private translateService: TranslateService) {}

    setAppLanguage(lang: string) {
        if (!lang) this.currunetLanguage = 'Fr';
        this.translateService.setDefaultLang(lang);
        this.translateService.use(lang);
    }
}
