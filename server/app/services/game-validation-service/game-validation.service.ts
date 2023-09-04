import { Bmp } from '@app/classes/bmp/bmp';
import { Difference } from '@app/constants/game';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class GameValidation {
    constructor(private bmpSubtractor: BmpSubtractorService, private bmpDifferenceInterpreter: BmpDifferenceInterpreter) {}

    async numberDifference(original: Bmp, modify: Bmp, radius: number) {
        return this.differenceBmp(original, modify, radius).then(async (bmpDifferentiated: Bmp) =>
            this.bmpDifferenceInterpreter.getCoordinates(bmpDifferentiated).then((coordinates: Coordinate[][]) => coordinates.length),
        );
    }

    async differenceBmp(original: Bmp, modify: Bmp, radius: number) {
        return this.bmpSubtractor.getDifferenceBMP(original, modify, radius).then((differenceBMP: Bmp) => differenceBMP);
    }

    async isNbDifferenceValid(original: Bmp, modify: Bmp, radius: number) {
        return this.numberDifference(original, modify, radius).then(
            (nbDifference: number) => nbDifference >= Difference.MIN && nbDifference <= Difference.MAX,
        );
    }
}
