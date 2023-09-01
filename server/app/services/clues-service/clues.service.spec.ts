import { CluesService } from '@app/services/clues-service/clues.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { stub } from 'sinon';
import { Container } from 'typedi';

describe('Clues Service', () => {
    let cluesService: CluesService;
    let gameManager: GameManagerService;

    beforeEach(() => {
        cluesService = Container.get(CluesService);
        gameManager = Container.get(GameManagerService);
    });

    it('Should return the quadrant corners coordinates where the pixel is in the image on a scale of 1/4', () => {
        const pixelCoordinate = { x: 120, y: 400 };
        const expectedResult = [
            { x: 0, y: 240 },
            { x: 320, y: 480 },
        ];
        expect(cluesService.firstCluePosition(pixelCoordinate)).to.deep.equal(expectedResult);
    });

    it('Should return the quadrant corners coordinates where the pixel is in the image on a scale of 1/16', () => {
        const pixelCoordinate = { x: 120, y: 400 };
        const expectedResult = [
            { x: 0, y: 360 },
            { x: 160, y: 480 },
        ];
        expect(cluesService.secondCluePosition(pixelCoordinate)).to.deep.equal(expectedResult);
    });

    it('Should return the coordinate value if the user is using the third clue', () => {
        const pixelCoordinate = { x: 120, y: 400 };
        const expectedResult = [pixelCoordinate, { x: -1, y: -1 }];
        expect(cluesService.thirdCluePosition(pixelCoordinate)).to.deep.equal(expectedResult);
    });

    it('Should return a random index for a specific length', () => {
        const length = 10;
        expect(cluesService['findRandomIndex'](length)).to.be.greaterThanOrEqual(0).and.to.be.lessThan(length);
    });

    it('Should find a random difference in the left differences array', () => {
        const gameId = '';
        const spyLeftDifferences = stub(gameManager, 'getNbDifferenceNotFound').callsFake(() => {
            return [[{ x: 1, y: 1 }]];
        });
        const expectedResult = [{ x: 1, y: 1 }];
        const differenceResult = cluesService.findRandomDifference(gameId);
        expect(spyLeftDifferences.called);
        expect(differenceResult).to.deep.equal(expectedResult);
    });

    it('Should find a random pixel in a random difference in the left differences array', () => {
        const gameId = '';
        const result = cluesService.findRandomPixel(gameId);
        const expectedPixel = { x: 1, y: 1 };
        expect(result).to.deep.equal(expectedPixel);
    });
});
