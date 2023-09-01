import { Coordinate } from '@common/coordinate';

export class Queue {
    private array: Coordinate[] = [];

    add(data: Coordinate): void {
        this.array.push(data);
    }

    remove(): Coordinate | undefined {
        if (this.isEmpty()) return undefined;

        return this.array.shift() as Coordinate;
    }

    peek(): Coordinate | undefined {
        if (this.isEmpty()) return undefined;
        return this.array[0];
    }

    isEmpty(): boolean {
        return this.array.length === 0;
    }
}
