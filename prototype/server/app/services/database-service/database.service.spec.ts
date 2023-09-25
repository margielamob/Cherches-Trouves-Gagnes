import { DB_NAME } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { LoggerService } from '@app/services/logger-service/logger.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
chai.use(chaiAsPromised);

describe('Database service', () => {
    let mongoServer: MongoMemoryServer;
    let databaseService: DatabaseService;
    let uri = '';
    let logger: LoggerService;

    beforeEach(async () => {
        logger = new LoggerService();
        databaseService = new DatabaseService(logger);
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
    });

    afterEach(async () => {
        if (databaseService['client']) {
            await databaseService.close();
        }
        sinon.restore();
    });

    it('There should be no client before starting the db', async () => {
        expect(databaseService['client']).to.equal(undefined);
    });

    it('start(uri) should create a client and a database with a given name', async () => {
        await databaseService.start(uri);
        expect(databaseService['client']).to.not.equal(undefined);
        expect(databaseService.database.databaseName).to.equal(DB_NAME);
    });

    it('start() should create a client and a database with a given name', async () => {
        await databaseService.start();
        expect(databaseService['client']).to.not.equal(undefined);
        expect(databaseService.database.databaseName).to.equal(DB_NAME);
    });

    it('start() should not do anything different if start() was already called', async () => {
        await databaseService.start();
        await databaseService.start();
        expect(databaseService['client']).to.not.equal(undefined);
        expect(databaseService.database.databaseName).to.equal(DB_NAME);
    });

    it('should log the error when failing to start the server', async () => {
        const logError = sinon.stub(logger, 'logError');
        sinon.stub(Object.getPrototypeOf(databaseService), 'initializeCollection').throws();
        await databaseService.start('invalid uri');
        expect(logError.calledOnce).to.equal(true);
    });
});
