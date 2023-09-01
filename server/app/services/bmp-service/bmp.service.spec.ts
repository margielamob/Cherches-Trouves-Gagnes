import { Bmp } from '@app/classes/bmp/bmp';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import { describe } from 'mocha';
import { tmpdir } from 'os';
import * as sinon from 'sinon';
import { Container } from 'typedi';

chai.use(chaiAsPromised);

describe('Bmp service', async () => {
    let bmpService: BmpService;
    let bmpEncoderService: BmpEncoderService;
    let idGeneratorService: sinon.SinonStubbedInstance<IdGeneratorService>;

    beforeEach(async () => {
        idGeneratorService = sinon.createStubInstance(IdGeneratorService);
        idGeneratorService['generateNewId'].callsFake(() => {
            return '5';
        });
        bmpEncoderService = Container.get(BmpEncoderService);
        bmpService = new BmpService(idGeneratorService as IdGeneratorService, bmpEncoderService);
    });

    it("getBmpById(id) should return throw an exception if the id doesn't exist", async () => {
        const invalidId = 'invalid-id-test-1000';
        await expect(bmpService.getBmpById(invalidId, tmpdir())).to.eventually.be.rejected.and.be.an.instanceof(Error);
    });

    it('addBmp(bmp) should create a file and store it with a unique id', async () => {
        const width = 2;
        const height = 2;
        const defaultRawData = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
        const bmpObj = new Bmp({ width, height }, defaultRawData);
        const converedObj = 'Qk1GAAAAAAAAADYAAAAoAAAAAgAAAP7///8BABgAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAQIDAQIDAAABAgMBAgMAAA==';
        await bmpService.addBmp(await bmpObj.toImageData(), tmpdir());
        await expect(bmpService.getBmpById('5', tmpdir())).to.eventually.deep.equal(converedObj);
        await bmpService.deleteGameImages(['5'], tmpdir());
    });

    it('should delete all the bmp files in the directory', async () => {
        const width = 2;
        const height = 2;
        const defaultRawData = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
        const bmpObj = new Bmp({ width, height }, defaultRawData);
        const dir = './assets/test-dir';

        await bmpService.addBmp(await bmpObj.toImageData(), dir);
        await bmpService.deleteAllSourceImages(dir);
        expect((await fs.promises.readdir(dir)).length).to.equal(1);
    });
});
