import { Service } from 'typedi';
import { v4 } from 'uuid';

@Service()
export class IdGeneratorService {
    generateNewId(): string {
        return v4();
    }
}
