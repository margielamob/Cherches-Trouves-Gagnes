import { Pixel } from '@app/classes/pixel/pixel';
import { PIXEL_DEPT } from '@app/constants/encoding';
import { PIXEL_OFFSET } from '@app/constants/pixel-offset';
import { Dimension } from '@app/interface/dimension';
import * as bmp from 'bmp-js';
import { Buffer } from 'buffer';
export class Bmp {
    private dimensions: Dimension;
    private pixels: Pixel[][];

    constructor(dimensions: Dimension, rawData: number[], pixels?: Pixel[][]) {
        if (!this.areParametersValid(dimensions, rawData, pixels)) throw new Error('The parameters given for creating a bmp are invalid');
        if (pixels) {
            this.pixels = pixels;
        } else {
            this.pixels = this.convertRawToPixels(rawData, dimensions);
        }
        this.dimensions = dimensions;
    }

    static async convertRGBAToARGB(data: number[]): Promise<number[]> {
        const rgba = [];
        const nbCaracterRGBA = 4;
        for (let i = 0; i < data.length / nbCaracterRGBA; i++) {
            rgba.push(data[i * nbCaracterRGBA + 3]);
            rgba.push(data[i * nbCaracterRGBA + 2]);
            rgba.push(data[i * nbCaracterRGBA + 1]);
            rgba.push(data[i * nbCaracterRGBA]);
        }
        return rgba;
    }

    async toImageData(): Promise<ImageData> {
        const imageData: ImageData = {
            colorSpace: 'srgb',
            width: this.dimensions.width,
            height: this.dimensions.height,
            data: new Uint8ClampedArray(Buffer.from(Pixel.convertPixelsToBGRA(this.pixels))),
        };
        return imageData;
    }

    async toBmpImageData(): Promise<bmp.ImageData> {
        const imageData: bmp.ImageData = {
            width: this.dimensions.width,
            height: this.dimensions.height,
            data: await this.getPixelBuffer(),
        };
        return bmp.encode(imageData);
    }

    getWidth(): number {
        return this.dimensions.width;
    }

    getHeight(): number {
        return this.dimensions.height;
    }

    getPixels(): Pixel[][] {
        return this.pixels;
    }

    private async getPixelBuffer(): Promise<Buffer> {
        return Buffer.from(Pixel.convertPixelsToARGB(this.pixels));
    }

    private convertRawToPixels(rawData: number[], dimensions: Dimension): Pixel[][] {
        const pixels = [];
        for (let i = 0; i < dimensions.height; i++) {
            const scanLine = [];

            for (let j = 0; j < dimensions.width; j++) {
                const beginRange = (i * dimensions.width + j) * PIXEL_DEPT;
                const pixel: Pixel = this.getPixel(rawData.slice(beginRange, beginRange + PIXEL_DEPT));
                scanLine.push(pixel);
            }
            pixels.push(scanLine);
        }
        return pixels;
    }

    private getPixel(pixelBuffered: number[]): Pixel {
        const r = pixelBuffered[PIXEL_OFFSET.red];
        const g = pixelBuffered[PIXEL_OFFSET.green];
        const b = pixelBuffered[PIXEL_OFFSET.blue];
        return new Pixel(r, g, b);
    }

    private arePixelDimensionsValid(expectedDimensions: Dimension, pixelDimension: Dimension) {
        return (
            expectedDimensions.height * expectedDimensions.width === pixelDimension.height * pixelDimension.width &&
            expectedDimensions.height === pixelDimension.height &&
            expectedDimensions.width === pixelDimension.width
        );
    }

    private areBufferDimensionsValid(expectedDimensions: Dimension, rawData: number[]) {
        return rawData.length === PIXEL_DEPT * expectedDimensions.height * expectedDimensions.width;
    }

    private areBmpDimensionsValid(dimensions: Dimension) {
        return dimensions.width > 0 && dimensions.height > 0;
    }

    private areParametersValid(dimensions: Dimension, rawData: number[], pixels: Pixel[][] | undefined): boolean {
        if (!this.areBmpDimensionsValid(dimensions)) return false;

        if (pixels) {
            return this.arePixelDimensionsValid(dimensions, { width: pixels[0].length, height: pixels.length });
        } else {
            return this.areBufferDimensionsValid(dimensions, rawData);
        }
    }
}
