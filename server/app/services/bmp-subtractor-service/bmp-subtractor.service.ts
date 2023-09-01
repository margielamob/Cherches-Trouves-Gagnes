import { Bmp } from '@app/classes/bmp/bmp';
import { ImageEnlargementService } from '@app/services/image-enlargement-service/image-enlargement-service';
import { Service } from 'typedi';

@Service()
export class BmpSubtractorService {
    constructor(private imageEnlargementService: ImageEnlargementService) {}

    async getDifferenceBMP(originalImage: Bmp, modifiedImage: Bmp, radius: number): Promise<Bmp> {
        if (!this.areBmpCompatible(originalImage, modifiedImage)) {
            throw new Error('Both images do not have the same height or width');
        }
        // 25 ms
        await this.getDifference(originalImage, modifiedImage);

        // 991.966 ms
        this.applyEnlargement(originalImage, radius);
        return originalImage;
    }

    private async getDifference(originalImage: Bmp, modifiedImage: Bmp): Promise<void> {
        for (let i = 0; i < originalImage.getHeight(); i++) {
            for (let j = 0; j < originalImage.getWidth(); j++) {
                if (originalImage.getPixels()[i][j].isEqual(modifiedImage.getPixels()[i][j])) {
                    originalImage.getPixels()[i][j].setWhite();
                } else {
                    originalImage.getPixels()[i][j].setBlack();
                }
            }
        }
    }

    private async applyEnlargement(imageToEnlarge: Bmp, radius: number): Promise<Bmp> {
        if (radius < 0) throw new Error('radius should be greater or equal to zero');
        if (radius === 0) return imageToEnlarge;

        this.imageEnlargementService.applyEnlargement(imageToEnlarge, radius);
        return imageToEnlarge;
    }

    private areBmpCompatible(originalImage: Bmp, modifiedImage: Bmp): boolean {
        return originalImage.getHeight() === modifiedImage.getHeight() && originalImage.getWidth() === modifiedImage.getWidth();
    }
}
