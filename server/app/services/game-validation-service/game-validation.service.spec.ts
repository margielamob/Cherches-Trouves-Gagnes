import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { expect } from 'chai';
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

    it('should get difference from Bmp object', async () => {
        const expectedDifferences = {} as Bmp;
        const expectedReject = 'test failed error';
        bmpSubtractor.getDifferenceBMP.resolves(expectedDifferences);
        expect(await gameValidation.differenceBmp({} as Bmp, {} as Bmp, 0)).to.equal(expectedDifferences);
        bmpSubtractor.getDifferenceBMP.rejects(new Error(expectedReject));
        await gameValidation.differenceBmp({} as Bmp, {} as Bmp, 0).catch((reason: Error) => expect(reason.message).to.equal(expectedReject));
    });

    afterEach(() => {
        restore();
    });
});
