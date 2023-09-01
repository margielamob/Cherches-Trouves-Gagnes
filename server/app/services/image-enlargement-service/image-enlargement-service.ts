import { Bmp } from '@app/classes/bmp/bmp';
import { EnlargementAlgorithm } from '@app/interface/enlargement-algorithm';
import { ManhattanAlgorithm } from '@app/services/manhattan-algorithm/manhattan-algorithm';
import { Service } from 'typedi';

@Service()
export class ImageEnlargementService {
    private enlargementAlgorithm: EnlargementAlgorithm;

    constructor() {
        this.enlargementAlgorithm = new ManhattanAlgorithm();
    }

    applyEnlargement(imageToEnlarge: Bmp, radius: number): void {
        this.enlargementAlgorithm.applyEnlargement(imageToEnlarge, radius);
    }
}
