/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ReplayEvent } from './replay-interfaces';

export class EventArray {
    currentIndex = 0;

    private array: ReplayEvent[];

    constructor() {
        this.array = [];
    }

    get length(): number {
        return this.array.length;
    }

    push(event: ReplayEvent): void {
        this.array.push(event);
    }

    isEmpty(): boolean {
        return this.array.length === 0;
    }

    clear(): void {
        this.array = [];
    }

    end() {
        return this.currentIndex === this.length;
    }

    getEvent(idx: number) {
        return this.array[idx];
    }

    getCurrentEvent() {
        return this.array[this.currentIndex];
    }

    getTotalSeconds() {
        return Math.round(this.array[this.length - 1].timestamp - this.array[0].timestamp) / 1000;
    }
}
