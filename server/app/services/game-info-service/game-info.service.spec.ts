import { Bmp } from '@app/classes/bmp/bmp';
import { DB_URL } from '@app/constants/database';
import { GameCarousel } from '@app/interface/game-carousel';
import { PrivateGameInformation } from '@app/interface/game-info';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseServiceMock } from '@app/services/database-service/database.service.mock';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { DEFAULT_GAMES } from '@app/services/game-info-service/game-info.service.contants.spec';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { ImageRepositoryService } from '@app/services/image-repository/image-repository.service';
import { LoggerService } from '@app/services/logger-service/logger.service';
import { ScoreType } from '@common/score-type';
import { expect } from 'chai';
import { describe } from 'mocha';
import { tmpdir } from 'os';
import * as sinon from 'sinon';
import { stub } from 'sinon';
import { Container } from 'typedi';

describe('GameInfo Service', async () => {
    let gameInfoService: GameInfoService;
    let bmpSubtractorService: BmpSubtractorService;
    let bmpService: BmpService;
    let bmpDifferenceService: BmpDifferenceInterpreter;
    let databaseService: DatabaseServiceMock;
    let idGeneratorService: sinon.SinonStubbedInstance<IdGeneratorService>;
    let imageRepositoryService: ImageRepositoryService;
    let logger: LoggerService;

    beforeEach(async () => {
        bmpService = Container.get(BmpService);
        databaseService = new DatabaseServiceMock();
        bmpSubtractorService = Container.get(BmpSubtractorService);
        bmpDifferenceService = Container.get(BmpDifferenceInterpreter);
        idGeneratorService = sinon.createStubInstance(IdGeneratorService);
        imageRepositoryService = Container.get(ImageRepositoryService);
        logger = Container.get(LoggerService);
        idGeneratorService['generateNewId'].callsFake(() => {
            return '5';
        });
        gameInfoService = new GameInfoService(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- need any to test databaseService
            databaseService as any,
            bmpService,
            bmpSubtractorService,
            bmpDifferenceService,
            imageRepositoryService,
            logger,
        );
        gameInfoService['srcPath'] = tmpdir();
        await databaseService.start(DB_URL);
        await databaseService.initializeCollection();
    });

    afterEach(async () => {
        await databaseService.close();
        sinon.restore();
    });

    it('getGameInfoById(id) should return a game according to a specific id', async () => {
        await gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        await gameInfoService.addGameInfo(DEFAULT_GAMES[1]);
        await gameInfoService.addGameInfo(DEFAULT_GAMES[2]);
        expect(await gameInfoService.getGameInfoById('0')).to.deep.equal(DEFAULT_GAMES[0]);
    });

    it('getGameInfoById(id) should return a game according to a specific id', async () => {
        await gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        await gameInfoService.addGameInfo(DEFAULT_GAMES[1]);
        await gameInfoService.addGameInfo(DEFAULT_GAMES[2]);
        expect(await gameInfoService.getGameInfoById('2')).to.deep.equal(DEFAULT_GAMES[2]);
    });

    it('getGameInfoById(id) should return undefined if the specific id is out of range', async () => {
        expect(await gameInfoService.getGameInfoById('5')).to.equal(undefined);
    });

    it('getAllGameInfos() should return all of the games', async () => {
        await gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        await gameInfoService.addGameInfo(DEFAULT_GAMES[1]);
        await gameInfoService.addGameInfo(DEFAULT_GAMES[2]);
        const expectedGames = (await gameInfoService.getAllGameInfos()) as PrivateGameInformation[];
        expect(expectedGames.length).to.equal(DEFAULT_GAMES.length);
        for (let i = 0; i < DEFAULT_GAMES.length; i++) {
            expect(expectedGames[i]).to.deep.equal(DEFAULT_GAMES[i]);
        }
    });

    it('addGameInfo(gameInfo) should add a game to the game collection, getAllGames() should return them', async () => {
        expect(((await gameInfoService.getAllGameInfos()) as PrivateGameInformation[]).length).to.equal(0);
        await gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        expect(await gameInfoService.getGameInfoById('0')).to.deep.equal(DEFAULT_GAMES[0]);
        expect(((await gameInfoService.getAllGameInfos()) as PrivateGameInformation[]).length).to.equal(1);
    });

    it("addGameInfo(gameInfo) shouldn't add a game twice", async () => {
        expect(((await gameInfoService.getAllGameInfos()) as PrivateGameInformation[]).length).to.equal(0);
        await gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        await expect(gameInfoService.addGameInfo(DEFAULT_GAMES[0])).to.eventually.be.rejectedWith(Error);
        expect(((await gameInfoService.getAllGameInfos()) as PrivateGameInformation[]).length).to.equal(1);
    });

    it('resetAllGameInfo() should reset all of the games', async () => {
        await gameInfoService.deleteAllGamesInfo();
        expect(((await gameInfoService.getAllGameInfos()) as PrivateGameInformation[]).length).to.equal(0);
    });

    it('should validate that a page number is valid', () => {
        expect(gameInfoService['validatePageNumber'](0, 3)).to.equal(1);
        expect(gameInfoService['validatePageNumber'](1, 3)).to.equal(1);
        expect(gameInfoService['validatePageNumber'](2, 3)).to.equal(2);
        expect(gameInfoService['validatePageNumber'](2, 1)).to.equal(1);
    });

    it('should get the games information based on a page number', async () => {
        const value = (await gameInfoService.getGamesInfo(1)) as GameCarousel;
        expect(value.games).to.deep.equal([]);
    });

    it('should return null when getting games info based on page fails', async () => {
        await databaseService.close();
        const value = await gameInfoService.getGamesInfo(1);
        expect(value).to.deep.equal(null);
    });

    it('should return null when trying to get all games info with an error', async () => {
        await databaseService.close();
        const value = await gameInfoService.getAllGameInfos();
        expect(value).to.deep.equal(null);
    });

    it('should return null when ad game info wrapper fails', async () => {
        await databaseService.close();
        const value = await gameInfoService.addGameInfoWrapper(
            // eslint-disable-next-line @typescript-eslint/no-empty-function -- for testing purposes
            { original: { toImageData: () => {} } as Bmp, modify: { toImageData: () => {} } as Bmp },
            '',
            0,
        );
        expect(value).to.deep.equal(null);
    });

    it('should return null when trying to delete game info by id and failing', async () => {
        await databaseService.close();
        const value = await gameInfoService.deleteGameInfoById('0');
        expect(value).to.deep.equal(null);
    });

    it('should return null when trying to delete all games info and failing', async () => {
        await databaseService.close();
        const value = await gameInfoService.deleteAllGamesInfo();
        expect(value).to.deep.equal(null);
    });

    it('should return null when trying to reset all scores and failing', async () => {
        await databaseService.close();
        const value = await gameInfoService.resetAllHighScores();
        expect(value).to.deep.equal(null);
    });

    it('should return null when trying to reset single score and failing', async () => {
        await databaseService.close();
        const value = await gameInfoService.resetHighScores('0');
        expect(value).to.deep.equal(null);
    });

    it('should return null when trying to update score and failing', async () => {
        await databaseService.close();
        const value = await gameInfoService.updateHighScores('0', [], []);
        expect(value).to.deep.equal(null);
    });

    it('should get the scores', async () => {
        await gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        const value = await gameInfoService.getHighScores('0');
        expect(value?.multiplayerScore).to.deep.equal([]);
        expect(value?.soloScore).to.deep.equal([]);
    });

    it('should update the highscores', async () => {
        await gameInfoService.addGameInfo(DEFAULT_GAMES[0]);
        await gameInfoService.updateHighScores(
            '0',
            [{ playerName: 'jacob', time: 1, type: ScoreType.Default }],
            [{ playerName: 'jacob', time: 1, type: ScoreType.Default }],
        );
        expect((await gameInfoService.getHighScores('0'))?.multiplayerScore).to.deep.equal([
            { playerName: 'jacob', time: 1, type: ScoreType.Default },
        ]);
        expect((await gameInfoService.getHighScores('0'))?.soloScore).to.deep.equal([{ playerName: 'jacob', time: 1, type: ScoreType.Default }]);
    });

    it('should reset all the scores', async () => {
        const game1 = DEFAULT_GAMES[0];
        const game2 = DEFAULT_GAMES[1];
        game1.multiplayerScore = [{ playerName: 'jacob', time: 1, type: ScoreType.Default }];
        game1.multiplayerScore = [{ playerName: 'jacob', time: 1, type: ScoreType.Default }];
        game2.soloScore = [{ playerName: 'jacob', time: 1, type: ScoreType.Default }];
        game2.soloScore = [{ playerName: 'jacob', time: 1, type: ScoreType.Default }];
        gameInfoService.addGameInfo(game1);
        gameInfoService.addGameInfo(game2);
        await gameInfoService.resetAllHighScores();
        expect((await gameInfoService.getHighScores('0'))?.multiplayerScore).to.not.deep.equal(undefined);
        expect((await gameInfoService.getHighScores('1'))?.multiplayerScore).to.not.deep.equal(undefined);
        expect((await gameInfoService.getHighScores('0'))?.soloScore).to.not.deep.equal(undefined);
        expect((await gameInfoService.getHighScores('1'))?.soloScore).to.not.deep.equal(undefined);
    });

    it('should reset scores from single game', async () => {
        const game1 = DEFAULT_GAMES[0];
        game1.multiplayerScore = [{ playerName: 'jacob', time: 1, type: ScoreType.Default }];
        game1.soloScore = [{ playerName: 'jacob', time: 1, type: ScoreType.Default }];
        gameInfoService.addGameInfo(game1);
        await gameInfoService.resetHighScores('0');
        expect((await gameInfoService.getHighScores('0'))?.multiplayerScore).to.not.deep.equal(undefined);
        expect((await gameInfoService.getHighScores('0'))?.soloScore).to.not.deep.equal(undefined);
    });

    it('should return null if no game info', async () => {
        await databaseService.close();
        expect(await gameInfoService.getGameInfoById('')).to.equal(null);
    });

    it('should return null if no possible to update high score', async () => {
        stub(gameInfoService, 'getGameInfoById').throwsException();
        expect(await gameInfoService.getHighScores('')).to.equal(null);
    });
});
