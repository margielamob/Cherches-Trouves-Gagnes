import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import { MAX_VALUE_PIXEL, MIN_VALUE_PIXEL } from '@app/constants/encoding';
import { MidpointAlgorithm } from '@app/services/mid-point-algorithm/mid-point-algorithm';
import { Coordinate } from '@common/coordinate';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@common/image-size';
import { Service } from 'typedi';

@Service()
export class BmpSubtractorService {
    constructor(private midpointAlgorithm: MidpointAlgorithm) {}

    async getDifferenceBMP(originalImage: Bmp, modifiedImage: Bmp, radius: number): Promise<Bmp> {
        if (!this.areBmpCompatible(originalImage, modifiedImage)) {
            throw new Error('Both images do not have the same height or width');
        }
        const differenceImage0px: Bmp = await this.getDifference(originalImage, modifiedImage);
        return this.applyEnlargement(differenceImage0px, radius);
    }

    private async getDifference(originalImage: Bmp, modifiedImage: Bmp): Promise<Bmp> {
        const pixels: Pixel[][] = [];

        for (let i = 0; i < originalImage.getHeight(); i++) {
            const lineOfPixels: Pixel[] = [];
            for (let j = 0; j < originalImage.getWidth(); j++) {
                if (originalImage.getPixels()[i][j].isEqual(modifiedImage.getPixels()[i][j])) {
                    lineOfPixels.push(new Pixel(MAX_VALUE_PIXEL, MAX_VALUE_PIXEL, MAX_VALUE_PIXEL));
                } else {
                    lineOfPixels.push(new Pixel(MIN_VALUE_PIXEL, MIN_VALUE_PIXEL, MIN_VALUE_PIXEL));
                }
            }
            pixels.push(lineOfPixels);
        }
        return new Bmp({ width: modifiedImage.getWidth(), height: modifiedImage.getHeight() }, [], pixels);
    }

    private async applyEnlargement(modifiedImage: Bmp, radius: number): Promise<Bmp> {
        if (radius < 0) throw new Error('radius should be greater or equal to zero');
        if (radius === 0) return modifiedImage;

        const blackPixels: BmpCoordinate[] = await this.getContour(modifiedImage);
        const resultCoordinates: BmpCoordinate[] = await this.getCoordinatesAfterEnlargement(blackPixels, radius);

        const pixelResult: Pixel[][] = modifiedImage.getPixels();
        resultCoordinates.forEach((coord) => {
            if (this.isBmpCoordinateValid(coord, modifiedImage)) pixelResult[coord.toCoordinate().x][coord.toCoordinate().y].setBlack();
        });
        return new Bmp({ width: modifiedImage.getWidth(), height: modifiedImage.getHeight() }, Pixel.convertPixelsToARGB(pixelResult));
    }

    private isBmpCoordinateValid(coordinate: BmpCoordinate, image: Bmp) {
        return coordinate.toCoordinate().x < image.getHeight() && coordinate.toCoordinate().y < image.getWidth();
    }

    private isCoordinateValid(coord: Coordinate) {
        return coord.x >= 0 && coord.x < DEFAULT_IMAGE_HEIGHT && coord.y >= 0 && coord.y < DEFAULT_IMAGE_WIDTH;
    }

    private findPixelContour(pixel: Coordinate, contour: BmpCoordinate[], differenceBmp: Bmp) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const offsetX = pixel.x + i;
                const offsetY = pixel.y + j;
                if (this.isCoordinateValid({ x: offsetX, y: offsetY })) {
                    if (differenceBmp.getPixels()[offsetX][offsetY].isWhite()) {
                        contour.push(new BmpCoordinate(pixel.x, pixel.y));
                        return;
                    }
                }
            }
        }
    }

    private async getCoordinatesAfterEnlargement(originalCoordinates: BmpCoordinate[], radius: number): Promise<BmpCoordinate[]> {
        const resultCoordinates: BmpCoordinate[] = [];
        originalCoordinates.forEach((coordinate) => {
            const result = this.midpointAlgorithm.findEnlargementArea(coordinate, radius);
            result.forEach((coord) => {
                resultCoordinates.push(coord);
            });
        });
        return resultCoordinates;
    }

    private async getContour(differenceBmp: Bmp): Promise<BmpCoordinate[]> {
        const contour: BmpCoordinate[] = [];
        const pixels: Pixel[][] = differenceBmp.getPixels();
        for (let i = 0; i < pixels.length; i++) {
            for (let j = 0; j < pixels[i].length; j++) {
                if (pixels[i][j].isBlack()) {
                    this.findPixelContour({ x: i, y: j }, contour, differenceBmp);
                }
            }
        }
        return contour;
    }

    private areBmpCompatible(originalImage: Bmp, modifiedImage: Bmp): boolean {
        return originalImage.getHeight() === modifiedImage.getHeight() && originalImage.getWidth() === modifiedImage.getWidth();
    }
}
