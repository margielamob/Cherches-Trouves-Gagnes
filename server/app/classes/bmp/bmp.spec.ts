/* eslint-disable @typescript-eslint/no-magic-numbers -- bmp data numbers range of 1 - 255 */
import { Bmp } from '@app/classes/bmp/bmp';
import { EQUIVALENT_DATA, TEST_BMP_DATA } from '@app/classes/bmp/bmp.spec.contants';
import { Pixel } from '@app/classes/pixel/pixel';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Bmp', () => {
    it('The constructor should construct an image with the right width', () => {
        const bmpProduced1 = new Bmp(TEST_BMP_DATA[0].dimensions, TEST_BMP_DATA[0].data);
        expect(bmpProduced1.getWidth()).to.equals(TEST_BMP_DATA[0].dimensions.width);

        const bmpProduced2 = new Bmp(TEST_BMP_DATA[2].dimensions, TEST_BMP_DATA[2].data);
        expect(bmpProduced2.getWidth()).to.equals(TEST_BMP_DATA[2].dimensions.width);
    });

    it('The constructor should construct an image with the right height', () => {
        const bmpProduced1 = new Bmp(TEST_BMP_DATA[0].dimensions, TEST_BMP_DATA[0].data);
        expect(bmpProduced1.getHeight()).to.equals(TEST_BMP_DATA[0].dimensions.height);

        const bmpProduced2 = new Bmp(TEST_BMP_DATA[2].dimensions, TEST_BMP_DATA[2].data);
        expect(bmpProduced2.getHeight()).to.equals(TEST_BMP_DATA[2].dimensions.height);
    });

    it('The constructor should construct an image with the right pixels', () => {
        const bmpProduced = new Bmp(TEST_BMP_DATA[0].dimensions, TEST_BMP_DATA[0].data);
        expect(bmpProduced.getPixels()).to.deep.equal(EQUIVALENT_DATA);
    });

    it('The constructor should construct an image with the pixels in parameters', () => {
        const pixel: Pixel = new Pixel(1, 2, 3);

        const bmpProduced = new Bmp(
            TEST_BMP_DATA[0].dimensions,
            [],
            [
                [pixel, pixel],
                [pixel, pixel],
            ],
        );
        expect(bmpProduced.getPixels()).to.deep.equal(EQUIVALENT_DATA);
    });

    it('The constructor should construct an image with the pixels in parameters', async () => {
        const pixels: Pixel[][] = [
            [new Pixel(1, 2, 3), new Pixel(2, 3, 4)],
            [new Pixel(3, 4, 5), new Pixel(4, 5, 6)],
            [new Pixel(5, 6, 7), new Pixel(6, 7, 8)],
        ];
        const bmpObj = new Bmp(TEST_BMP_DATA[2].dimensions, [], pixels);
        expect(bmpObj.getPixels()).to.equal(pixels);
    });

    it('The constructor should throw an error when given an image with the pixels in parameters', async () => {
        const pixels: Pixel[][] = [
            [new Pixel(1, 2, 3), new Pixel(2, 3, 4)],
            [new Pixel(3, 4, 5), new Pixel(4, 5, 6)],
            [new Pixel(5, 6, 7), new Pixel(6, 7, 8)],
        ];
        expect(() => {
            new Bmp({ width: 3, height: 2 }, [], pixels);
        }).to.throw(Error);
    });

    it('An exception should be thrown if the width is less or equal to 0', () => {
        expect(() => {
            new Bmp({ width: -1, height: 1 }, [255, 1, 2, 3]);
        }).to.throw(Error);
    });

    it('An exception should be throw if the height is less or equal to 0', () => {
        expect(() => {
            new Bmp({ width: 1, height: -1 }, [0, 1, 2, 3]);
        }).to.throw(Error);
    });

    it("An exception should be throw if the pixels given aren't equal to the depth", () => {
        expect(() => {
            new Bmp({ width: 1, height: 0 }, [], [[new Pixel(1, 1, 1)]]);
        }).to.throw(Error);
    });

    it('The number of pixels should match the width, the height and the depth of the pixels', () => {
        expect(() => {
            new Bmp({ width: 1, height: 3 }, [0, 1, 2, 3, 0]);
        }).to.throw(Error);
    });
    it('convertRawToPixels() should convert an array of numbers into pixels', async () => {
        const pixel1: Pixel = new Pixel(1, 2, 3);
        const pixel2: Pixel = new Pixel(1, 2, 3);
        const pixel3: Pixel = new Pixel(1, 2, 3);
        const pixel4: Pixel = new Pixel(1, 2, 3);
        const pixels: Pixel[][] = [
            [pixel1, pixel2],
            [pixel3, pixel4],
        ];
        const bmpObj = new Bmp(TEST_BMP_DATA[0].dimensions, TEST_BMP_DATA[0].data);
        expect(bmpObj['convertRawToPixels'](TEST_BMP_DATA[0].data, TEST_BMP_DATA[0].dimensions)).to.deep.equal(pixels);
    });

    it('convertRawToPixels() should work with different pixels', async () => {
        const pixels: Pixel[][] = [
            [new Pixel(1, 2, 3), new Pixel(2, 3, 4)],
            [new Pixel(3, 4, 5), new Pixel(4, 5, 6)],
        ];
        const bmpObj = new Bmp(TEST_BMP_DATA[1].dimensions, TEST_BMP_DATA[1].data);
        expect(bmpObj['convertRawToPixels'](TEST_BMP_DATA[1].data, TEST_BMP_DATA[1].dimensions)).to.deep.equal(pixels);
    });

    it('convertRawToPixels() should work with different size of arrays', async () => {
        const pixels: Pixel[][] = [
            [new Pixel(1, 2, 3), new Pixel(2, 3, 4)],
            [new Pixel(3, 4, 5), new Pixel(4, 5, 6)],
            [new Pixel(5, 6, 7), new Pixel(6, 7, 8)],
        ];
        const bmpObj = new Bmp(TEST_BMP_DATA[2].dimensions, TEST_BMP_DATA[2].data);
        expect(bmpObj['convertRawToPixels'](TEST_BMP_DATA[2].data, TEST_BMP_DATA[2].dimensions)).to.deep.equal(pixels);
    });

    it('toImageData() should convert the data from the bmp object into an ImageData format', async () => {
        const bmpObj = new Bmp(TEST_BMP_DATA[0].dimensions, TEST_BMP_DATA[0].data);

        const colorSpace = 'srgb';
        const imageDataExpected: ImageData = {
            colorSpace,
            width: TEST_BMP_DATA[0].dimensions.width,
            height: TEST_BMP_DATA[0].dimensions.height,
            data: new Uint8ClampedArray(Pixel.convertPixelsToBGRA(bmpObj.getPixels())),
        };
        expect(await bmpObj.toImageData()).to.deep.equal(imageDataExpected);
    });
});
