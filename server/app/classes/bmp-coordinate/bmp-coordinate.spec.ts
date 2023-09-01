import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Coordinate } from '@common/coordinate';
import { expect } from 'chai';
import { describe } from 'mocha';

/* eslint-disable @typescript-eslint/no-magic-numbers -- bmp coordinate tests with random numbers*/
describe('BmpCoordinate', () => {
    it('BmpCoordinate constructor should create a coordinate with positive values', () => {
        const row = 0;
        const column = 1;
        const coordinate = new BmpCoordinate(row, column);
        expect(coordinate).to.be.instanceOf(BmpCoordinate);
        expect(coordinate.getX()).to.be.equal(row);
        expect(coordinate.getY()).to.be.equal(column);
    });

    it('BmpCoordinate constructor should not allow negative coordinates', () => {
        const coordinate = new BmpCoordinate(-1, 1);
        expect(coordinate.getX()).to.equal(undefined);
    });

    it('BmpCoordinate constructor should not allow negative coordinates', () => {
        const coordinate = new BmpCoordinate(1, -1);
        expect(coordinate.getX()).to.equal(undefined);
    });

    it('BmpCoordinate constructor should not allow outside bounds coordinates height', () => {
        const coordinate = new BmpCoordinate(480, 0);
        expect(coordinate.getX()).to.equal(undefined);
    });

    it('BmpCoordinate constructor should not allow outside bounds coordinates width', () => {
        const coordinate = new BmpCoordinate(0, 640);
        expect(coordinate.getX()).to.equal(undefined);
    });

    it('toCoordinate() should convert BmpCoordinates to Coordinate', () => {
        const coordinate = new BmpCoordinate(1, 2);
        const expectedCoordinate: Coordinate = {
            x: coordinate.getX(),
            y: coordinate.getY(),
        };
        expect(expectedCoordinate.x).to.equal(coordinate.toCoordinate().x);
        expect(expectedCoordinate.y).to.equal(coordinate.toCoordinate().y);
    });
});
