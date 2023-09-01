import { Bmp } from '@app/classes/bmp/bmp';

export interface EnlargementAlgorithm {
    applyEnlargement(imageToEnlarge: Bmp, radius: number): void;
}
