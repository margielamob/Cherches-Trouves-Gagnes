import { DB_GAME_COLLECTION, DB_NAME } from '@app/constants/database';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
export class DatabaseServiceMock {
    private mongoServer: MongoMemoryServer;
    private client: MongoClient;
    private db: Db;

    get database(): Db {
        return this.db;
    }

    // eslint-disable-next-line no-unused-vars -- test for database
    async start(url?: string): Promise<void> {
        if (!this.client) {
            this.mongoServer = await MongoMemoryServer.create();
            const mongoUri = this.mongoServer.getUri();
            this.client = new MongoClient(mongoUri);
            await this.client.connect();
            this.db = this.client.db(DB_NAME);
        }
    }

    async close(): Promise<void> {
        if (this.client) {
            return this.client.close();
        } else {
            return Promise.resolve();
        }
    }

    async initializeCollection(collectionName: string = DB_GAME_COLLECTION): Promise<void> {
        if (!(await this.doesCollectionExists(collectionName))) {
            await this.db.createCollection(collectionName);
        }
    }

    private async doesCollectionExists(collectionName: string): Promise<boolean> {
        return !((await this.db.listCollections({ name: collectionName }).toArray()).length === 0);
    }
}
