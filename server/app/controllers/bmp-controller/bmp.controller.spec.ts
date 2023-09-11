import { Application } from '@app/app';
import { ImageRepositoryService } from '@app/services/image-repository/image-repository.service';
import { ImageRef } from '@common/image-ref';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('Bmp Controller', () => {
    let expressApp: Express.Application;
    let imageRepositoryServiceSpyObj: SinonStubbedInstance<ImageRepositoryService>;

    beforeEach(async () => {
        imageRepositoryServiceSpyObj = createStubInstance(ImageRepositoryService);
        const app = Container.get(Application);
        Object.defineProperty(app['bmpController'], 'imageRepo', { value: imageRepositoryServiceSpyObj });
        expressApp = app.app;
    });

    it('should get image with id', async () => {
        imageRepositoryServiceSpyObj.getImageRefById.resolves({ base64String: 'image' } as unknown as ImageRef);
        return supertest(expressApp)
            .get('/api/bmp/original')
            .expect(StatusCodes.OK)
            .then((response) => {
                expect(response.body.image).to.equal('image');
            });
    });

    it('should not get image with incorrect id', async () => {
        imageRepositoryServiceSpyObj.getImageRefById.rejects();
        return supertest(expressApp).get('/api/bmp/0').expect(StatusCodes.NOT_FOUND);
    });
});
