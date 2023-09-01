import { promises as fs } from 'fs';
import { Service } from 'typedi';

@Service()
export class BmpEncoderService {
    async base64Encode(file: string): Promise<string> {
        const body = await fs.readFile(file);
        return body.toString('base64');
    }
}
