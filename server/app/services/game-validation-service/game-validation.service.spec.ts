import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { createStubInstance, restore, SinonStubbedInstance } from 'sinon';
import { GameValidation } from './game-validation.service';

describe('GameValidation', () => {
    let gameValidation: GameValidation;
    let bmpSubtractor: SinonStubbedInstance<BmpSubtractorService>;
    let bmpDifferenceInterpreterSpyObj: SinonStubbedInstance<BmpDifferenceInterpreter>;
    // let differenceSpyObj: SinonSpiedInstance<BmpDifferenceInterpreter>;

    beforeEach(() => {
        bmpSubtractor = createStubInstance(BmpSubtractorService);
        bmpDifferenceInterpreterSpyObj = createStubInstance(BmpDifferenceInterpreter);
        gameValidation = new GameValidation(bmpSubtractor, bmpDifferenceInterpreterSpyObj);
    });

    it('should get the number of difference', async () => {
        console.log(gameValidation);
    });

    it('should get difference from Bmp object', async () => {});

    it('should return check if the number of differences is valid', async () => {});

    afterEach(() => {
        restore();
    });
});
