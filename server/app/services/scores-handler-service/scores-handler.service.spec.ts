import { ScoresHandlerService } from '@app/services/scores-handler-service/scores-handler.service';
import * as sinon from 'sinon';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { expect } from 'chai';
import { Score } from '@common/score';
import { stub } from 'sinon';
import { PrivateGameInformation } from '@app/interface/game-info';
import { ScoreType } from '@common/score-type';

describe('ScoresHandlerService', () => {
    let service: ScoresHandlerService;
    let gameInfoService: sinon.SinonStubbedInstance<GameInfoService>;

    beforeEach(() => {
        gameInfoService = sinon.createStubInstance(GameInfoService);
        service = new ScoresHandlerService(gameInfoService);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should verify score in solo', async () => {
        const expectedIndex = 0;
        stub(Object.getPrototypeOf(service), 'getScores')
            .callsFake(async () => new Promise<void>((resolve) => resolve()))
            .resolves();
        stub(Object.getPrototypeOf(service), 'tryAddScore')
            .callsFake(async () => new Promise((resolve) => resolve(expectedIndex)))
            .resolves(expectedIndex);
        stub(Object.getPrototypeOf(service), 'clearScores')
            .callsFake(async () => new Promise<void>((resolve) => resolve()))
            .resolves();
        stub(Object.getPrototypeOf(service), 'trimArrayToSize').callsFake((array: Score[]) => array);
        gameInfoService.getHighScores.callsFake(async () => new Promise((resolve) => resolve({ soloScore: [], multiplayerScore: [] }))).resolves();
        gameInfoService.updateHighScores.callsFake(async () => new Promise((resolve) => resolve())).resolves();
        const index = await service.verifyScore('gameId', { playerName: 'name', time: 1, type: ScoreType.Default }, false);
        expect(index).equal(expectedIndex);
    });

    it('should verify score in multi', async () => {
        const expectedIndex = 0;
        stub(Object.getPrototypeOf(service), 'getScores')
            .callsFake(async () => new Promise<void>((resolve) => resolve()))
            .resolves();
        stub(Object.getPrototypeOf(service), 'tryAddScore')
            .callsFake(async () => new Promise((resolve) => resolve(expectedIndex)))
            .resolves(expectedIndex);
        stub(Object.getPrototypeOf(service), 'clearScores')
            .callsFake(async () => new Promise<void>((resolve) => resolve()))
            .resolves();
        stub(Object.getPrototypeOf(service), 'trimArrayToSize').callsFake((array: Score[]) => array);
        gameInfoService.getHighScores.callsFake(async () => new Promise((resolve) => resolve({ soloScore: [], multiplayerScore: [] }))).resolves();
        gameInfoService.updateHighScores.callsFake(async () => new Promise((resolve) => resolve())).resolves();
        const index = await service.verifyScore('gameId', { playerName: 'name', time: 1, type: ScoreType.Default }, true);
        expect(index).equal(expectedIndex);
    });

    it('should trim the array if there are more than 3 values', () => {
        const array = service['trimArrayToSize']([{} as Score, {} as Score, {} as Score, {} as Score]);
        expect(array.length).equal(3);
    });

    it('should not trim the array if there are not more than 3 values', () => {
        const array = service['trimArrayToSize']([{} as Score, {} as Score]);
        expect(array.length).equal(2);
    });

    it('should clear the scores arrays', () => {
        service['soloScores'] = [{} as Score, {} as Score];
        service['multiScores'] = [{} as Score, {} as Score];
        service['clearScores']();
        expect(service['soloScores'].length).equal(0);
        expect(service['multiScores'].length).equal(0);
    });

    it('should get the scores', async () => {
        gameInfoService.getHighScores
            .callsFake(async () => new Promise((resolve) => resolve({ soloScore: [], multiplayerScore: [] })))
            .resolves({ soloScore: [], multiplayerScore: [] } as unknown as PrivateGameInformation);
        await service['getScores']('gameId');
        expect(service['soloScores'].length).equal(0);
        expect(service['multiScores'].length).equal(0);
    });

    it('should add the score in the array if the array is empty', () => {
        const score = { playerName: 'name', time: 1, type: ScoreType.Default };
        service['tryAddScore'](score, service['soloScores']);
        expect(service['soloScores'].length).equal(1);
    });

    it('should add the score in the array if the array is not empty', () => {
        const score = { playerName: 'name', time: 1, type: ScoreType.Default };
        service['soloScores'] = [score];
        service['tryAddScore'](score, service['soloScores']);
        expect(service['soloScores'].length).equal(2);
    });

    it('should not add the score in the array if the array is full', () => {
        const expectedSize = 4;
        const score = { playerName: 'name', time: 1, type: ScoreType.Default };
        service['soloScores'] = [score, score, score];
        service['tryAddScore'](score, service['soloScores']);
        expect(service['soloScores'].length).equal(expectedSize);
    });

    it('should not add the score in the top 3 array if the score is not the best', () => {
        const expectedSize = 4;
        const score = { playerName: 'name', time: 1, type: ScoreType.Default };
        service['soloScores'] = [score, score, score];
        service['tryAddScore']({ playerName: 'name', time: 2, type: ScoreType.Default }, service['soloScores']);
        expect(service['soloScores'].length).equal(expectedSize);
    });

    it('should add the score in the array if the score is the best', () => {
        const expectedSize = 4;
        const score = { playerName: 'name', time: 1, type: ScoreType.Default };
        service['soloScores'] = [score, score, score];
        service['tryAddScore']({ playerName: 'name', time: 0, type: ScoreType.Default }, service['soloScores']);
        expect(service['soloScores'].length).equal(expectedSize);
    });
});
