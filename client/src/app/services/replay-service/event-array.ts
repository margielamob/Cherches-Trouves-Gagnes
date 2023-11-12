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

    getTotalTime() {
        let sum = 0;
        for (let i = 0; i < this.length; i++) {
            if (i + 1 > this.length) break;
            sum += this.array[i + 1].timestamp - this.array[i].timestamp;
        }
        return sum;
    }
}
