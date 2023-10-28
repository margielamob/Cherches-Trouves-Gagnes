/* eslint-disable max-params */
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ReplayService {
    isReplaying: boolean = false;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
    constructor() {}
}
