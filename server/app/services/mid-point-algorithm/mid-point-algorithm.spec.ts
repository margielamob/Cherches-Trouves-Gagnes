import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Coordinate } from '@common/coordinate';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';
import { MidpointAlgorithm } from './mid-point-algorithm';

/* eslint-disable @typescript-eslint/no-magic-numbers -- test with random numbers */
describe('Midpoint Algorithn', async () => {
    let midpointAlgorithm: MidpointAlgorithm;

    beforeEach(async () => {
        midpointAlgorithm = Container.get(MidpointAlgorithm);
    });

    it('findContourEnlargement(...) should return return center when radius is 0', () => {
        const center: BmpCoordinate = new BmpCoordinate(2, 3);
        const radius = 0;
        const coordinates: BmpCoordinate[] = midpointAlgorithm['findContourEnlargement'](center, radius);

        expect(coordinates.length).to.equal(1);
        expect(coordinates[0].getX()).to.equal(2);
        expect(coordinates[0].getY()).to.equal(3);
    });

    it('isInQuadrant(...) should return correct value is in Quadrant', () => {
        const distanceCorrect: Coordinate = { x: 3, y: 1 };
        const distanceCIncorrect: Coordinate = { x: 1, y: 3 };
        const distanceCIncorrect2: Coordinate = { x: 1, y: 1 };
        expect(midpointAlgorithm['isInQuadrant'](distanceCorrect)).to.equal(true);
        expect(midpointAlgorithm['isInQuadrant'](distanceCIncorrect)).to.equal(false);
        expect(midpointAlgorithm['isInQuadrant'](distanceCIncorrect2)).to.equal(false);
    });

    it('isOutsideQuadrant(...) should return correct value is outside Quadrant', () => {
        const distanceCorrect: Coordinate = { x: 1, y: 3 };
        const distanceCIncorrect: Coordinate = { x: 3, y: 1 };
        const distanceCIncorrect2: Coordinate = { x: 1, y: 1 };
        expect(midpointAlgorithm['isOutsideQuadrant'](distanceCorrect)).to.equal(true);
        expect(midpointAlgorithm['isOutsideQuadrant'](distanceCIncorrect)).to.equal(false);
        expect(midpointAlgorithm['isOutsideQuadrant'](distanceCIncorrect2)).to.equal(false);
    });

    it('invertDistance(...) should invert the distance coordinates', () => {
        const distance: Coordinate = { x: 1, y: 3 };
        const distanceInverted = midpointAlgorithm['invertDistance'](distance);
        const expectedDistance: Coordinate = { x: 3, y: 1 };

        expect(distanceInverted.x).to.equal(expectedDistance.x);
        expect(distanceInverted.y).to.equal(expectedDistance.y);
    });

    it('perimeterIsNegative(...) should return correct value if perimeter is negative', () => {
        const perimeterCorrect = -1;
        const perimeterCorrect2 = 0;
        const perimeterIncorrect = 1;
        expect(midpointAlgorithm['perimeterIsNegative'](perimeterCorrect)).to.equal(true);
        expect(midpointAlgorithm['perimeterIsNegative'](perimeterCorrect2)).to.equal(true);
        expect(midpointAlgorithm['perimeterIsNegative'](perimeterIncorrect)).to.equal(false);
    });

    it('isNotEquidistant(...) should return true if is not equidistant', () => {
        const distanceEquidistant: Coordinate = { x: 1, y: 1 };
        const distanceNotEquidistant: Coordinate = { x: 1, y: 3 };
        expect(midpointAlgorithm['isNotEquidistant'](distanceNotEquidistant)).to.equal(true);
        expect(midpointAlgorithm['isNotEquidistant'](distanceEquidistant)).to.equal(false);
    });

    it('incrementPerimeter(...) should increment the perimeter correctly ', () => {
        const distance: Coordinate = { x: 1, y: 3 };
        const perimeterPositive = 1;
        const expectedPerimeterPositive = 8;
        const perimeterNegative = -1;
        const expectedPerimeterNegative = 6;

        expect(midpointAlgorithm['incrementPerimeter'](perimeterPositive, distance)).to.equal(expectedPerimeterPositive);
        expect(midpointAlgorithm['incrementPerimeter'](perimeterNegative, distance)).to.equal(expectedPerimeterNegative);
    });

    it('addInitial4Coords(...) should add all four initial coordinates ', () => {
        const center: BmpCoordinate = new BmpCoordinate(2, 2);
        const distance: Coordinate = { x: 1, y: 3 };
        const coordinates: BmpCoordinate[] = [];
        midpointAlgorithm['addInitial4Coords'](center, distance, coordinates);

        expect(coordinates.length).to.equal(4);
        expect(coordinates[0].getX()).to.equal(3);
        expect(coordinates[0].getY()).to.equal(2);
        expect(coordinates[1].getX()).to.equal(1);
        expect(coordinates[1].getY()).to.equal(2);
        expect(coordinates[2].getX()).to.equal(2);
        expect(coordinates[2].getY()).to.equal(3);
        expect(coordinates[3].getX()).to.equal(2);
        expect(coordinates[3].getY()).to.equal(1);
    });

    it('addInitial4Coords(...) should not add coord if coord is negative', () => {
        const center: BmpCoordinate = new BmpCoordinate(0, 0);
        const distance: Coordinate = { x: 1, y: 3 };
        const coordinates: BmpCoordinate[] = [];
        midpointAlgorithm['addInitial4Coords'](center, distance, coordinates);

        expect(coordinates.length).to.equal(2);
    });

    it('addInitial4Coords(...) should not add coord if coord is outside bound', () => {
        const center: BmpCoordinate = new BmpCoordinate(479, 639);
        const distance: Coordinate = { x: 1, y: 3 };
        const coordinates: BmpCoordinate[] = [];
        midpointAlgorithm['addInitial4Coords'](center, distance, coordinates);

        expect(coordinates.length).to.equal(2);
    });
});
