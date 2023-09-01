/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Bmp } from '@app/classes/bmp/bmp';
import { EnlargementAlgorithm } from '@app/interface/enlargement-algorithm';
import { Coordinate } from '@common/coordinate';

export class ManhattanAlgorithm implements EnlargementAlgorithm {
    applyEnlargement(image: Bmp, radius: number): void {
        const contour: number[][] = [];
        this.findCountour(image, contour);
        const binaryMatrix = new Array(image.getHeight());
        for (let i = 0; i < binaryMatrix.length; i++) {
            binaryMatrix[i] = new Array(image.getWidth()).fill(0);
        }
        for (const pixel of contour) {
            this.enlargeArea(pixel[0], pixel[1], binaryMatrix, radius);
        }
        const pixels = image.getPixels();
        for (let i = 0; i < image.getHeight(); i++) {
            for (let j = 0; j < image.getWidth(); j++) {
                if (binaryMatrix[i][j] === 1) {
                    pixels[i][j].setBlack();
                }
            }
        }
    }

    findCountour(image: Bmp, contour: number[][]) {
        const borderPixels: Coordinate[] = [
            { x: -1, y: -1 },
            { x: -1, y: 1 },
            { x: 1, y: -1 },
            { x: 1, y: 1 },
        ];

        const pixels = image.getPixels();
        for (let i = 0; i < image.getHeight(); i++) {
            for (let j = 0; j < image.getWidth(); j++) {
                if (pixels[i][j].isBlack()) {
                    let isContour = false;
                    for (const border of borderPixels) {
                        const y = i + border.y;
                        const x = j + border.x;
                        if (y >= 0 && y < image.getHeight() && x >= 0 && x < image.getWidth() && pixels[y][x].isWhite() && !isContour) {
                            contour.push([i, j]);
                            isContour = true;
                        }
                    }
                }
            }
        }
    }

    // eslint-disable-next-line max-params
    private enlargeArea(y: number, x: number, binaryMatrix: number[][], radius: number) {
        for (let i = -radius; i < radius; i++) {
            for (let j = -radius; j < radius; j++) {
                const posY = y + i;
                const posX = x + j;
                if (
                    Math.abs(i) + Math.abs(j) <= radius &&
                    posY + i >= 0 &&
                    posY + i < binaryMatrix.length &&
                    posX + j >= 0 &&
                    posX + j < binaryMatrix[0].length &&
                    binaryMatrix[posY][posX] === 0
                ) {
                    binaryMatrix[posY][posX] = 1;
                }
            }
        }
    }
}
