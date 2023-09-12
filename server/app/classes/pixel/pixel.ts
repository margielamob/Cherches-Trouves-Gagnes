import { MAX_VALUE_PIXEL } from '@app/constants/encoding';
import { PIXEL_COLOR } from '@app/constants/pixel-color';

export class Pixel {
    r: number;
    g: number;
    b: number;
    a: number;
    isVisited: boolean = false;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = MAX_VALUE_PIXEL;
    }

    static convertPixelsToARGB(pixelMatrix: Pixel[][]): number[] {
        const raw: number[] = [];
        pixelMatrix.forEach((lineOfPixels) => {
            lineOfPixels.forEach((pixel) => {
                raw.push(pixel.a);
                raw.push(pixel.r);
                raw.push(pixel.g);
                raw.push(pixel.b);
            });
        });
        return raw;
    }

    static convertPixelsToBGRA(pixelMatrix: Pixel[][]): number[] {
        const raw: number[] = [];
        pixelMatrix.forEach((lineOfPixels) => {
            lineOfPixels.forEach((pixel) => {
                raw.push(pixel.b);
                raw.push(pixel.g);
                raw.push(pixel.r);
                raw.push(pixel.a);
            });
        });
        return raw;
    }

    isEqual(pixel: Pixel) {
        return pixel.a === this.a && pixel.b === this.b && pixel.g === this.g && pixel.r === this.r;
    }

    isWhite() {
        return this.isColor(PIXEL_COLOR.white);
    }

    isBlack() {
        return this.isColor(PIXEL_COLOR.black);
    }

    setBlack() {
        this.setColor(PIXEL_COLOR.black);
    }

    private isColor(color: number) {
        return this.r === color && this.g === color && this.b === color;
    }

    private setColor(color: number) {
        this.b = color;
        this.g = color;
        this.r = color;
    }
}
