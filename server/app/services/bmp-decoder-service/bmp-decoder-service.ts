import { Bmp } from '@app/classes/bmp/bmp';
import * as bmp from 'bmp-js';
import { promises as fs } from 'fs';
import { Service } from 'typedi';

@Service()
export class BmpDecoderService {
    async decodeBIntoBmp(filepath: string): Promise<Bmp> {
        if (!this.isFileExtensionValid(filepath)) throw new Error('The file should end with .bmp');
        const bmpBuffer: Buffer = await fs.readFile(filepath);
        let bmpData: bmp.BmpDecoder;
        try {
            bmpData = bmp.decode(bmpBuffer);
        } catch (e) {
            throw new Error('Decoding the BMP file failed');
        }
        const rawData: number[] = bmpData.data.toJSON().data;
        return new Bmp({ width: bmpData.width, height: bmpData.height }, rawData);
    }

    private isFileExtensionValid(filename: string): boolean {
        return filename.match('^.*.(bmp)$') !== null;
    }
}
