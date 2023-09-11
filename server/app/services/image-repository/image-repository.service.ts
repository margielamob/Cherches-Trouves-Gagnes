import { DB_IMAGE_COLLECTION } from '@app/constants/database';
import { DatabaseService } from '@app/services/database-service/database.service';
import { LoggerService } from '@app/services/logger-service/logger.service';
import { ImageRef } from '@common/image-ref';
import * as LZString from 'lz-string';
import { Collection } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class ImageRepositoryService {
    constructor(private databaseService: DatabaseService, private logger: LoggerService) {}

    get collection(): Collection<ImageRef> {
        return this.databaseService.database.collection(DB_IMAGE_COLLECTION);
    }

    async getImageRefById(id: string) {
        try {
            const image = await this.collection.findOne({ id });
            return image as ImageRef;
        } catch (error) {
            this.logger.logError(error);
            return undefined;
        }
    }

    async insertOne(imageRef: ImageRef) {
        try {
            this.compressImage(imageRef);
            const document = await this.collection.insertOne(imageRef);
            this.logger.logInfo(`inserted image with id ${imageRef.id} successfully !`);
            return document.insertedId;
        } catch (error) {
            this.logger.logError(error);
            return undefined;
        }
    }

    async destroyAllDocuments() {
        try {
            await this.collection.deleteMany({});
        } catch (error) {
            this.logger.logError(error);
        }
    }

    async destroyOneDocument(id: string) {
        try {
            await this.databaseService.database.collection(DB_IMAGE_COLLECTION).deleteOne({ id });
        } catch (error) {
            this.logger.logError(error);
        }
    }

    private compressImage(imageRef: ImageRef) {
        imageRef.base64String = LZString.compressToUTF16(imageRef.base64String);
    }
}
