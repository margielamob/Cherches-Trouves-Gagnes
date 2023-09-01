import { Bmp } from '@app/classes/bmp/bmp';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';
import { ManhattanAlgorithm } from './manhattan-algorithm';

describe.only('ManhattanAlgorithm', async () => {
    let manhattanAlgorithm: ManhattanAlgorithm;

    beforeEach(async () => {
        manhattanAlgorithm = Container.get(ManhattanAlgorithm);
    });

    it('findContour(...) should return the black pixels surrounded by a contour', () => {
        // eslint-disable-next-line -- no magic number
        const rawData = [0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255];
        const width = 2;
        const height = 2;
        const bmp = new Bmp({ width, height }, rawData);

        const contour: number[][] = [];
        manhattanAlgorithm.findCountour(bmp, contour);
        expect(contour.length).to.equal(0);
    });
});
