import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import { describe } from 'mocha';
import { Container } from 'typedi';
chai.use(chaiAsPromised);

describe('Bmp encoder service', async () => {
    let bmpEncoderService: BmpEncoderService;

    beforeEach(async () => {
        bmpEncoderService = Container.get(BmpEncoderService);
    });

    afterEach(() => {
        const base64FileConverted = './assets/test-bmp/convertionFile.bmp';
        const resultFilePath = './assets/test-bmp/result.bmp';
        const incorrectFileExtension = './assets/test-bmp/jpg_test.jpg';
        fs.unlink(resultFilePath, () => {
            return;
        });
        fs.unlink(incorrectFileExtension, () => {
            return;
        });
        fs.unlink(base64FileConverted, () => {
            return;
        });
    });

    it('should convert a file into a base64 string', async () => {
        const originalBmpFilePath = './assets/test-bmp/test_bmp_original.bmp';
        const base64String = await bmpEncoderService.base64Encode(originalBmpFilePath);
        const base64StringExpected = fs.readFileSync(originalBmpFilePath).toString('base64');
        expect(base64String).to.equal(base64StringExpected);
    });
});
