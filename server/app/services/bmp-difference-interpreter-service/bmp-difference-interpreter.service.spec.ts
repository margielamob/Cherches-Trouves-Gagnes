import { Bmp } from '@app/classes/bmp/bmp';
import { BmpDecoderService } from '@app/services/bmp-decoder-service/bmp-decoder-service';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { Coordinate } from '@common/coordinate';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { Container } from 'typedi';
chai.use(chaiAsPromised);

describe('Bmp difference interpreter service', async () => {
    let bmpDifferenceInterpreter: BmpDifferenceInterpreter;
    let bmpDecoderService: BmpDecoderService;
    beforeEach(async () => {
        bmpDifferenceInterpreter = Container.get(BmpDifferenceInterpreter);
        bmpDecoderService = Container.get(BmpDecoderService);
    });

    it("A white image shouldn't have any difference", async () => {
        // eslint-disable-next-line -- no magic number
        const rawData = [0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255, 0, 255, 255, 255];
        const width = 2;
        const height = 2;
        const bmpWithColors = new Bmp({ width, height }, rawData);
        const nbOfDifference = 0;

        const coordinates: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpWithColors);
        expect(coordinates.length).to.equal(nbOfDifference);
    });

    it('A black image should have one difference', async () => {
        const nbOfDifference = 1;
        const blackImageFilepath = './assets/test-bmp/test-performance/blackImage.bmp';
        const bmpDecoded = await bmpDecoderService.decodeBIntoBmp(blackImageFilepath);
        const differences: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpDecoded);
        expect(differences.length).to.equal(nbOfDifference);
    });

    it('A big black region on an image should be considered as one difference ', async () => {
        const nbOfDifference = 1;
        const blackImageFilepath = './assets/test-bmp/test-performance/majorityBlackImage.bmp';
        const bmpDecoded = await bmpDecoderService.decodeBIntoBmp(blackImageFilepath);
        const differences: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpDecoded);
        expect(differences.length).to.equal(nbOfDifference);
    });

    it('An array of difference should contain all of the differences', async () => {
        const numberOfDifferences = 2;
        const filepath = './assets/test-bmp/two_difference_appart.bmp';
        const decodedBmp = await bmpDecoderService.decodeBIntoBmp(filepath);
        const interpretedBmp: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(decodedBmp);
        expect(interpretedBmp.length).to.equal(numberOfDifferences);
    });

    it('The algorithm should also work on a bmp with a large width and height', async () => {
        const filepath = './assets/test-bmp/image_7_diff.bmp';
        const bmpDecoded = await bmpDecoderService.decodeBIntoBmp(filepath);
        const nbOfDifference = 7;
        const differences: Coordinate[][] = await bmpDifferenceInterpreter.getCoordinates(bmpDecoded);
        expect(differences.length).to.equal(nbOfDifference);
    });
});
