import { Bmp } from '@app/classes/bmp/bmp';
import { Difference } from '@app/constants/game';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { Service } from 'typedi';

@Service()
export class GameValidation {
    constructor(private bmpSubtractor: BmpSubtractorService, private bmpDifferenceInterpreter: BmpDifferenceInterpreter) {}

    async getNumberDifference(finalImage: Bmp) {
        // TODO: more optimisation
        return this.bmpDifferenceInterpreter.getNumberOfDifference(finalImage);
    }

    async differenceBmp(original: Bmp, modify: Bmp, radius: number) {
        this.bmpSubtractor.getDifferenceBMP(original, modify, radius);
        return original;
    }

    async isNbDifferenceValid(nbDifference: number) {
        return nbDifference >= Difference.MIN && nbDifference <= Difference.MAX;
    }

    async applyRadiusEnlargement(original: Bmp, modified: Bmp, radius: number) {
        return await this.bmpSubtractor.getDifferenceBMP(original, modified, radius);
    }
}
