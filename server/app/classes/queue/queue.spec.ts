import { Coordinate } from '@common/coordinate';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { Queue } from './queue';
chai.use(chaiAsPromised);

describe('Queue', () => {
    it('Should add a coordinate into queue', () => {
        const coordinateToadd: Coordinate = { x: 1, y: 1 };
        const queue = new Queue();
        queue.add(coordinateToadd);
        expect(queue['array'][0]).to.equal(coordinateToadd);
    });

    it('Should remove the first coord from the queue when using the remove method ', () => {
        const queue = new Queue();
        queue.add({ x: 2, y: 5 });
        queue.add({ x: 1, y: 1 });
        const expectedCoordinate: Coordinate = { x: 1, y: 1 };
        queue.remove();
        expect(queue['array'][0]).to.deep.eq(expectedCoordinate);
    });

    it('Should return undefined when using peek method with an empty array', () => {
        const queue = new Queue();
        expect(queue.peek()).to.equal(undefined);
    });

    it('Should return undefined when using remove method with an empty array', () => {
        const queue = new Queue();
        expect(queue.remove()).to.equal(undefined);
    });

    it('Should only read the first element in the queue when using peek method ', () => {
        const queue = new Queue();
        queue.add({ x: 2, y: 5 });
        queue.add({ x: 1, y: 1 });
        const expectedCoordinate: Coordinate | undefined = queue.peek();
        expect(queue['array'][0]).to.deep.eq(expectedCoordinate);
    });

    it('Should not remove the first element in the queue when using peek method ', () => {
        const queue = new Queue();
        queue.add({ x: 10, y: 6 });
        const expectedCoordinate: Coordinate | undefined = queue.peek();
        expect(queue['array'][0]).to.deep.eq(expectedCoordinate);
    });
    it('Should return false if the queue is empty ', () => {
        const queue = new Queue();
        expect(queue.isEmpty()).to.equal(true);
    });

    it('Should return true if the queue is not empty', () => {
        const queue = new Queue();
        queue.add({ x: 10, y: 6 });
        expect(queue.isEmpty()).to.equal(false);
    });
});
