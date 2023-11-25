import { Bmp } from '@app/classes/bmp/bmp';
import { promises as fs } from 'fs';
import { Service } from 'typedi';

@Service()
export class BmpEncoderService {
    async encodeBmpIntoB(filepath: string, bmpObj: Bmp): Promise<void> {
        if (!(await this.isFileExtensionValid(filepath))) throw new Error('File extension must be a .bmp');
        await fs.writeFile(filepath, (await bmpObj.toBmpImageData()).data);
    }

    async base64Encode(file: string): Promise<string> {
        const body = await fs.readFile(file);
        return body.toString('base64');
    }

    private async isFileExtensionValid(filename: string): Promise<boolean> {
        return filename.match('^.*.(bmp)$') !== null;
    }
}
