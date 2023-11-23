/* eslint-disable @typescript-eslint/no-magic-numbers */
// in this file, the magic numbers (60) are common values used in time conversion
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TimeFormatterService {
    private precision: number = 2;

    formatTime(seconds?: number): string {
        if (seconds) {
            const min = Math.floor(seconds / 60).toString();
            const sec = (seconds % 60).toString();
            return `${min.padStart(this.precision, '0')}:${sec.padStart(this.precision, '0')}`;
        } else {
            return 'UNDEFINED';
        }
    }

    formatTimeForScore(seconds: number): string {
        const min = seconds >= 60 ? Math.floor(seconds / 60).toString() + ' minute(s) et ' : '';
        const sec = (seconds % 60).toString() + ' secondes';
        return `${min}${sec}`;
    }
}
