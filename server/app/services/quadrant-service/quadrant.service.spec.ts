import { FindQuadrantService } from '@app/services/quadrant-service/quadrant.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';

describe('Find Quadrant service', () => {
    let findQuadrantService: FindQuadrantService;

    beforeEach(() => {
        findQuadrantService = Container.get(FindQuadrantService);
    });

    it('Should return the position of a pixel if its to the right or to the left ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const rightPixelCoordinate = { x: 500, y: 300 };
        const leftPixelCoordinate = { x: 350, y: 300 };
        expect(findQuadrantService['isToTheRight'](rightPixelCoordinate, leftUpperCoord.x, rightBottomCoord.x)).to.equal(true);
        expect(findQuadrantService['isToTheRight'](leftPixelCoordinate, leftUpperCoord.x, rightBottomCoord.x)).to.equal(false);
    });

    it('Should return the position of a pixel if its to the top or to the bottom ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const topPixelCoordinate = { x: 500, y: 400 };
        const bottomPixelCoordinate = { x: 350, y: 300 };
        expect(findQuadrantService['isOnTop'](topPixelCoordinate, leftUpperCoord.x, rightBottomCoord.x)).to.equal(true);
        expect(findQuadrantService['isOnTop'](bottomPixelCoordinate, leftUpperCoord.x, rightBottomCoord.x)).to.equal(false);
    });

    it('Should return true if the pixel is in the first quadrant ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const pixelCoordinate = { x: 500, y: 250 };
        expect(findQuadrantService['isInFirstQuadrant'](pixelCoordinate, leftUpperCoord, rightBottomCoord)).to.equal(true);
    });

    it('Should return true if the pixel is in the second quadrant ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const pixelCoordinate = { x: 350, y: 250 };
        expect(findQuadrantService['isInSecondQuadrant'](pixelCoordinate, leftUpperCoord, rightBottomCoord)).to.equal(true);
    });

    it('Should return true if the pixel is in the third quadrant ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const pixelCoordinate = { x: 350, y: 400 };
        expect(findQuadrantService['isInThirdQuadrant'](pixelCoordinate, leftUpperCoord, rightBottomCoord)).to.equal(true);
    });

    it('Should return the first quadrant corners coordinates if the pixel is in the first quadrant ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const expectedResult = [
            { x: 480, y: 240 },
            { x: 640, y: 360 },
        ];
        const pixelCoordinate = { x: 500, y: 250 };
        expect(findQuadrantService.findQuadrant(pixelCoordinate, leftUpperCoord, rightBottomCoord)).to.deep.equal(expectedResult);
    });

    it('Should return the second quadrant corners coordinates if the pixel is in the second quadrant ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const expectedResult = [
            { x: 320, y: 240 },
            { x: 480, y: 360 },
        ];
        const pixelCoordinate = { x: 350, y: 250 };
        expect(findQuadrantService.findQuadrant(pixelCoordinate, leftUpperCoord, rightBottomCoord)).to.deep.equal(expectedResult);
    });

    it('Should return the third quadrant corners coordinates if the pixel is in the third quadrant ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const expectedResult = [
            { x: 320, y: 360 },
            { x: 480, y: 480 },
        ];
        const pixelCoordinate = { x: 350, y: 400 };
        expect(findQuadrantService.findQuadrant(pixelCoordinate, leftUpperCoord, rightBottomCoord)).to.deep.equal(expectedResult);
    });

    it('Should return the fourth quadrant corners coordinates if the pixel is in the fourth quadrant ', () => {
        const leftUpperCoord = { x: 320, y: 240 };
        const rightBottomCoord = { x: 640, y: 480 };
        const expectedResult = [
            { x: 480, y: 360 },
            { x: 640, y: 480 },
        ];
        const pixelCoordinate = { x: 500, y: 400 };
        expect(findQuadrantService.findQuadrant(pixelCoordinate, leftUpperCoord, rightBottomCoord)).to.deep.equal(expectedResult);
    });
});
