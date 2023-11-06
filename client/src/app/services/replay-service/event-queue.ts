import { ReplayEvent } from './replay-interfaces';

export class EventQueue {
    private queue: ReplayEvent[];
    private queueBackup: ReplayEvent[] = [];
    private startingTime$: Date;

    constructor() {
        this.queue = [];
    }

    get length(): number {
        return this.queue.length;
    }

    get startingTime(): Date {
        return this.startingTime$;
    }

    set startingTime(start: Date) {
        this.startingTime$ = start;
    }

    enqueue(event: ReplayEvent): void {
        this.queue.push(event);
    }

    dequeue(): ReplayEvent | undefined {
        return this.queue.shift();
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    peek(): ReplayEvent | undefined {
        return !this.isEmpty() ? this.queue[0] : undefined;
    }

    clear(): void {
        this.queue = [];
    }

    backupQueue(): void {
        for (const event of this.queue) {
            this.queueBackup.push(event);
        }
    }

    resetQueue(): void {
        this.queue = this.queueBackup;
    }
}
