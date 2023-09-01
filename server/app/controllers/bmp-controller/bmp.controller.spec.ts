import { Application } from '@app/app';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('Bmp Controller', () => {
    let expressApp: Express.Application;
    let bmpServiceSpyObj: SinonStubbedInstance<BmpService>;

    beforeEach(async () => {
        bmpServiceSpyObj = createStubInstance(BmpService);
        const app = Container.get(Application);
        Object.defineProperty(app['bmpController'], 'bmpService', { value: bmpServiceSpyObj });
        expressApp = app.app;
    });

    it('should get image with id', async () => {
        bmpServiceSpyObj.getBmpById.callsFake(async () => Promise.resolve(''));
        return supertest(expressApp)
            .get('/api/bmp/original')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body.image).to.equal('');
            });
    });

    it('should not get image with incorrect id', async () => {
        bmpServiceSpyObj.getBmpById.rejects();
        return supertest(expressApp).get('/api/bmp/0').expect(StatusCodes.NOT_FOUND);
    });
});
