import { Bmp } from '@app/classes/bmp/bmp';
import { Difference } from '@app/constants/game';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class GameValidation {
    constructor(private bmpSubtractor: BmpSubtractorService, private bmpDifferenceInterpreter: BmpDifferenceInterpreter) {}

    async findNbDifference(modifiedImage: Bmp) {
        return this.bmpDifferenceInterpreter.getCoordinates(modifiedImage).then((coordinates: Coordinate[][]) => coordinates.length);
    }

    async differenceBmp(original: Bmp, modify: Bmp, radius: number) {
        return this.bmpSubtractor.getDifferenceBMP(original, modify, radius).then((differenceBMP: Bmp) => differenceBMP);
    }

    async isNbDifferenceValid(nbDifference: number) {
        return nbDifference >= Difference.MIN && nbDifference <= Difference.MAX;
    }

    async getDifferenceBMP(original: Bmp, modify: Bmp, radius: number): Promise<Bmp> {
        return await this.bmpSubtractor.getDifferenceBMP(original, modify, radius);
    }
}
