export enum LanguageCode {
    Fr = 'Français',
    En = 'English',
}

export const languageCodeMap = new Map<string, string>(Object.entries(LanguageCode).map(([code, language]) => [language, code]));
