import { Bmp } from '@app/classes/bmp/bmp';
import { BMP_EXTENSION, ID_PREFIX } from '@app/constants/database';
import { BmpEncoderService } from '@app/services/bmp-encoder-service/bmp-encoder.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import * as bmp from 'bmp-js';
import * as fs from 'fs';
import * as path from 'path';
import { Service } from 'typedi';
@Service()
export class BmpService {
    constructor(private readonly idGeneratorService: IdGeneratorService, private readonly bmpEncoderService: BmpEncoderService) {}

    async getBmpById(bmpId: string, filepath: string): Promise<string> {
        const fullpath: string = path.join(filepath, ID_PREFIX + bmpId + BMP_EXTENSION);
        return await this.bmpEncoderService.base64Encode(fullpath);
    }

    async addBmp(bpmToConvert: ImageData, filepath: string): Promise<string> {
        const bmpData = {
            data: Buffer.from(await Bmp.convertRGBAToARGB(Array.from(bpmToConvert.data))),
            width: bpmToConvert.width,
            height: bpmToConvert.height,
        };

        const rawData = bmp.encode(bmpData);
        const bmpId: string = this.idGeneratorService.generateNewId();
        const fullpath = path.join(filepath, ID_PREFIX + bmpId + BMP_EXTENSION);

        await fs.promises.writeFile(fullpath, rawData.data);
        return bmpId;
    }

    async createImageRef(imageData: ImageData) {
        const bmpData = {
            data: Buffer.from(await Bmp.convertRGBAToARGB(Array.from(imageData.data))),
            width: imageData.width,
            height: imageData.height,
        };
        const rawData = bmp.encode(bmpData);
        return {
            base64String: rawData.data.toString('base64'),
            id: this.idGeneratorService.generateNewId(),
        };
    }

    async convertToBase64(imageData: ImageData) {
        const bmpData = {
            data: Buffer.from(await Bmp.convertRGBAToARGB(Array.from(imageData.data))),
            width: imageData.width,
            height: imageData.height,
        };
        const rawData = bmp.encode(bmpData);
        return rawData.data.toString('base64');
    }

    async deleteGameImages(imageIds: string[], filepath: string): Promise<void> {
        for (const imageId of imageIds) {
            await fs.promises.unlink(path.join(filepath, ID_PREFIX + imageId + BMP_EXTENSION));
        }
    }

    async deleteAllSourceImages(filepath: string): Promise<void> {
        const files: string[] = await fs.promises.readdir(filepath);
        const filesToDelete: string[] = [];

        for (const file of files) {
            if (file.includes(ID_PREFIX)) {
                filesToDelete.push(file.slice(0, -BMP_EXTENSION.length).slice(ID_PREFIX.length));
            }
        }

        await this.deleteGameImages(filesToDelete, filepath);
    }
}
