import { GameTimeConstantService } from './game-time-constants.service';
import { promises as fs } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-require-imports -- required for mocking
import Sinon = require('sinon');
import { expect } from 'chai';
import { GameTimeConstants } from '@common/game-time-constants';

describe('Game Time Constants Service', () => {
    let gameTimeConstantService: GameTimeConstantService;

    beforeEach(() => {
        gameTimeConstantService = new GameTimeConstantService();
    });

    it('should read the file and return the values', async () => {
        const readFileStub = Sinon.stub(fs, 'readFile');
        gameTimeConstantService.getGameTimeConstant();
        expect(readFileStub.calledOnce).equal(true);
        readFileStub.restore();
    });

    it('should write to the file', async () => {
        const writeFileStub = Sinon.stub(fs, 'writeFile');
        gameTimeConstantService.setGameTimeConstant({} as GameTimeConstants);
        expect(writeFileStub.calledOnce).equal(true);
        writeFileStub.restore();
    });
});
