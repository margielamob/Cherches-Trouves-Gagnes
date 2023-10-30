export enum Theme {
    Alternative = 'pink-bluegrey-theme',
    Default = 'deeppurple-amber-theme',
}

export const themeCodeMap = new Map<string, string>(Object.entries(Theme).map(([code, theme]) => [theme, code]));
