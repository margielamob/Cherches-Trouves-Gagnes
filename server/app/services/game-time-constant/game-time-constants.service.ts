import { Service } from 'typedi';
import { promises as fs } from 'fs';
import { GameTimeConstants } from '@common/game-time-constants';

@Service()
export class GameTimeConstantService {
    async getGameTimeConstant(): Promise<GameTimeConstants> {
        const file = await fs.readFile('./assets/game-time-constants.json');
        return JSON.parse(file.toString()) as GameTimeConstants;
    }

    async setGameTimeConstant(gameTimeConstants: GameTimeConstants): Promise<void> {
        await fs.writeFile('./assets/game-time-constants.json', JSON.stringify(gameTimeConstants));
    }
}
