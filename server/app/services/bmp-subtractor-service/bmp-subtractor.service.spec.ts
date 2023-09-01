import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { TEST_2X2_BMP_RADIUS_0PX } from '@app/services/bmp-subtractor-service/bmp-subtractor.service.spec.constants';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Container } from 'typedi';
import { BmpSubtractorService } from './bmp-subtractor.service';
chai.use(chaiAsPromised);

describe('Bmp subractor service', async () => {
    let bmpDecoderService: BmpDecoderService;
    let bmpSubtractorService: BmpSubtractorService;

    let bmp2x2: Bmp;
    let bmp2x3: Bmp;

    beforeEach(async () => {
        bmpDecoderService = Container.get(BmpDecoderService);
        bmpSubtractorService = Container.get(BmpSubtractorService);

        bmp2x2 = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/bmp_test_2x2.bmp');
        bmp2x3 = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/bmp_test_2x3.bmp');
    });

    it('Should produce a white bmp if two images are similar', async () => {
        const bmpProduced = await bmpSubtractorService.getDifferenceBMP(bmp2x2, bmp2x2, 0);
        expect(bmpProduced.getWidth()).to.deep.equal(TEST_2X2_BMP_RADIUS_0PX.width);
        expect(bmpProduced.getHeight()).to.deep.equal(TEST_2X2_BMP_RADIUS_0PX.height);
        expect(bmpProduced.getPixels()).to.deep.equal(TEST_2X2_BMP_RADIUS_0PX.pixelsExpected);
    });

    it('Should throw an error if the height of the two images is not the same', async () => {
        const radius = 0;
        await expect(bmpSubtractorService.getDifferenceBMP(bmp2x2, bmp2x3, radius))
            .to.eventually.be.rejectedWith('Both images do not have the same height or width')
            .and.be.an.instanceOf(Error);
    });

    it('Should throw an error if the width of the two images is not the same', async () => {
        const radius = 0;
        await expect(bmpSubtractorService.getDifferenceBMP(bmp2x3, bmp2x2, radius))
            .to.eventually.be.rejectedWith('Both images do not have the same height or width')
            .and.be.an.instanceOf(Error);
    });

    it('verifying that the value of radius is greater or equal to zero', async () => {
        const radius = -1;
        await expect(bmpSubtractorService.getDifferenceBMP(bmp2x2, bmp2x2, radius))
            .to.eventually.be.rejectedWith('radius should be greater or equal to zero')
            .and.be.an.instanceOf(Error);
    });

    it('getDifferenceBMP(...) Should apply 0 pixel enlargement radius for a given image', async () => {
        const radius = 0;
        const bmpWithRadiusOf0px = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-0px.bmp');
        const blackBmp = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/no-dot-with-no-radius.bmp');
        expect(bmpWithRadiusOf0px).to.deep.equal(await bmpSubtractorService.getDifferenceBMP(bmpWithRadiusOf0px, blackBmp, radius));
    });

    it('getDifferenceBMP(...) Should apply 0 pixel enlargement radius for a real image', async () => {
        const radius = 0;
        const whiteBmp = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-performance/white_bmp.bmp');
        const bmpWithRadius = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-performance/maxplus_diff.bmp');
        const bmpWithRadiusOf3px = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-performance/maxplus_diff.bmp');
        const bmpResulting = await bmpSubtractorService.getDifferenceBMP(bmpWithRadius, whiteBmp, radius);
        expect(bmpWithRadiusOf3px).to.deep.equal(bmpResulting);
    });

    it('getDifferenceBMP(...) Should apply 3 pixel enlargement radius for a given image', async () => {
        const radius = 3;
        const bmpWithRadius = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-0px.bmp');
        const whiteBmp = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/no-dot-with-no-radius.bmp');
        const bmpWithRadiusOf3px = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-3px.bmp');
        const bmpResulting = await bmpSubtractorService.getDifferenceBMP(bmpWithRadius, whiteBmp, radius);
        expect(bmpWithRadiusOf3px).to.deep.equal(bmpResulting);
    });

    it('getDifferenceBMP(...) Should apply 3 pixel enlargement radius for a real image', async () => {
        const radius = 3;
        const whiteBmp = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-performance/white_bmp.bmp');
        const bmpWithRadius = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-performance/maxplus_diff.bmp');
        const bmpWithRadiusOf3px = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-performance/real_img_3px.bmp');
        const bmpResulting = await bmpSubtractorService.getDifferenceBMP(bmpWithRadius, whiteBmp, radius);
        expect(bmpWithRadiusOf3px).to.deep.equal(bmpResulting);
    });

    it('getDifferenceBMP(...) Should apply 9 pixel enlargement radius for a given image', async () => {
        const radius = 9;
        const bmpWithRadiusOf0px = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-0px.bmp');
        const blackBmp = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/no-dot-with-no-radius.bmp');
        const bmpWithRadiusOf3px = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-9px.bmp');
        const bmpResulting = await bmpSubtractorService.getDifferenceBMP(bmpWithRadiusOf0px, blackBmp, radius);
        expect(bmpWithRadiusOf3px).to.deep.equal(bmpResulting);
    });

    it('getDifferenceBMP(...) Should apply 9 pixel enlargement radius for a real image', async () => {
        const radius = 9;
        const whiteBmp = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-performance/white_bmp.bmp');
        const bmpWithRadius = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-performance/maxplus_diff.bmp');
        const bmpWithRadiusOf3px = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-performance/real_img_9px.bmp');
        const bmpResulting = await bmpSubtractorService.getDifferenceBMP(bmpWithRadius, whiteBmp, radius);
        expect(bmpWithRadiusOf3px).to.deep.equal(bmpResulting);
    });

    it('getDifferenceBMP(...) Should apply 15 pixel enlargement radius for a given image', async () => {
        const radius = 15;
        const bmpWithRadiusOf0px = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-0px.bmp');
        const blackBmp = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/no-dot-with-no-radius.bmp');
        const bmpWithRadiusOf3px = await bmpDecoderService.decodeBIntoBmp('./assets/test-bmp/test-radius/dot-with-radius-15px.bmp');
        const bmpResulting = await bmpSubtractorService.getDifferenceBMP(bmpWithRadiusOf0px, blackBmp, radius);
        expect(bmpWithRadiusOf3px).to.deep.equal(bmpResulting);
    });
});
