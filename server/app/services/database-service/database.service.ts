import { DB_GAME_COLLECTION, DB_NAME, DB_URL } from '@app/constants/database';
import { Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';
import { LoggerService } from '../logger-service/logger.service';
@Service()
export class DatabaseService {
    private client: MongoClient;
    private db: Db;

    constructor(private readonly logger: LoggerService){}
    get database(): Db {
        return this.db;
    }

    async start(url: string = DB_URL): Promise<void> {
        if (!this.client) {
            try {
                this.client = new MongoClient(url);
                await this.client.connect();
                this.db = this.client.db(DB_NAME);
                await this.initializeCollection();
                this.logger.logInfo('database started successfully !');
            } catch (error) {
                this.logger.logError(error);
            }
        }
    }

    async close(): Promise<void> {
        this.client.close();
    }

    private async initializeCollection(collectionName: string = DB_GAME_COLLECTION): Promise<void> {
        if (!(await this.doesCollectionExist(collectionName))) {
            await this.db.createCollection(collectionName);
        }
    }

    private async doesCollectionExist(collectionName: string): Promise<boolean> {
        return !((await this.db.listCollections({ name: collectionName }).toArray()).length === 0);
    }
}
