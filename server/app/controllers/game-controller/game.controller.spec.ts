import { Application } from '@app/app';
import { GameCarousel } from '@app/interface/game-carousel';
import { PrivateGameInformation } from '@app/interface/game-info';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { GameTimeConstantService } from '@app/services/game-time-constant/game-time-constants.service';
import { GameValidation } from '@app/services/game-validation-service/game-validation.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('GameController', () => {
    let gameManager: SinonStubbedInstance<GameManagerService>;
    let gameInfo: SinonStubbedInstance<GameInfoService>;
    let gameValidation: SinonStubbedInstance<GameValidation>;
    let gameTimeConstantsService: SinonStubbedInstance<GameTimeConstantService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        gameInfo = createStubInstance(GameInfoService);
        gameValidation = createStubInstance(GameValidation);
        gameTimeConstantsService = createStubInstance(GameTimeConstantService);
        const app = Container.get(Application);
        Object.defineProperty(app['gameController'], 'gameManager', { value: gameManager });
        Object.defineProperty(app['gameController'], 'gameInfo', { value: gameInfo });
        Object.defineProperty(app['gameController'], 'gameValidation', { value: gameValidation });
        Object.defineProperty(app['gameController'], 'gameTimeConstantService', { value: gameTimeConstantsService });
        expressApp = app.app;
    });

    it('should fetch all games cards of the database', async () => {
        const expected = {
            games: [{} as PrivateGameInformation],
            information: {
                currentPage: 1,
                gamesOnPage: 1,
                nbOfGames: 1,
                nbOfPages: 1,
                hasNext: false,
                hasPrevious: false,
            },
        } as GameCarousel;

        gameInfo.getGamesInfo.resolves(expected);
        return supertest(expressApp)
            .get('/api/game/cards/?page=1')
            .then((response) => {
                expect(response.body).to.deep.equal({});
                expect(response.body.games).to.equal(undefined);
            });
    });

    it('should return bad request when page is undefined', async () => {
        gameInfo.getGamesInfo.rejects();
        return supertest(expressApp).get('/api/game/cards/?page=').expect(StatusCodes.BAD_REQUEST);
    });

    it('should return nothing if the games cards is empty', async () => {
        gameInfo.getGamesInfo.rejects();
        return supertest(expressApp).get('/api/game/cards/?page=1').expect(StatusCodes.BAD_REQUEST);
    });

    it('should return a bad request if one of the attribute needed is not here to validate a new game card', async () => {
        return supertest(expressApp).post('/api/game/card/validation').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return a bad request if one of the attribute needed is not here to create a new game card', async () => {
        return supertest(expressApp).post('/api/game/card').send({}).expect(StatusCodes.BAD_REQUEST);
    });

    it('should return Not Found if a problem in the attribute is detected', async () => {
        gameValidation.isNbDifferenceValid.rejects();
        gameValidation.findNbDifference.rejects();
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
        };
        return supertest(expressApp).post('/api/game/card/validation').send(expectedBody).expect(StatusCodes.NOT_FOUND);
    });

    it('should return Not Found if a problem in the attribute is detected', async () => {
        gameValidation.isNbDifferenceValid.rejects();
        gameValidation.findNbDifference.resolves();
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
        };
        return supertest(expressApp).post('/api/game/card/validation').send(expectedBody).expect(StatusCodes.NOT_FOUND);
    });

    it('should send not found if the game is not found', async () => {
        gameInfo.deleteGameInfoById.resolves().returns(Promise.resolve(false));
        return supertest(expressApp).delete('/api/game/cards/0').expect(StatusCodes.NOT_FOUND);
    });

    it('should send not found if the game is not found', async () => {
        gameInfo.deleteGameInfoById.resolves().returns(Promise.resolve(true));
        return supertest(expressApp).delete('/api/game/cards/0').expect(StatusCodes.ACCEPTED);
    });

    it('should send bad request if there is an error while deleting the game', async () => {
        gameInfo.deleteGameInfoById.rejects();
        return supertest(expressApp).delete('/api/game/cards/0').expect(StatusCodes.BAD_REQUEST);
    });

    it('should send accepted if all the games are deleted', async () => {
        gameInfo.deleteAllGamesInfo.resolves();
        return supertest(expressApp).delete('/api/game/cards').expect(StatusCodes.ACCEPTED);
    });

    it('should send bad request if there is an error while deleting all the games', async () => {
        gameInfo.deleteAllGamesInfo.rejects();
        return supertest(expressApp).delete('/api/game/cards').expect(StatusCodes.BAD_REQUEST);
    });

    it('should post new game time constants when valid', async () => {
        gameTimeConstantsService.setGameTimeConstant.resolves();
        return supertest(expressApp)
            .patch('/api/game/constants')
            .send({
                gameTime: 30,
                penaltyTime: 10,
                successTime: 10,
            })
            .expect(StatusCodes.OK);
    });

    it('should not post new game time constants when invalid', async () => {
        gameTimeConstantsService.setGameTimeConstant.rejects();
        return supertest(expressApp).patch('/api/game/constants').expect(StatusCodes.BAD_REQUEST);
    });

    it('should get game time constants when valid', async () => {
        gameTimeConstantsService.getGameTimeConstant.resolves();
        return supertest(expressApp).get('/api/game/constants').expect(StatusCodes.OK);
    });

    it('should not get game time constants when invalid', async () => {
        gameTimeConstantsService.getGameTimeConstant.rejects();
        return supertest(expressApp).get('/api/game/constants').expect(StatusCodes.BAD_REQUEST);
    });

    it('should reset scores for a specific game when valid', async () => {
        gameInfo.resetHighScores.resolves();
        return supertest(expressApp).patch('/api/game/scores/0/reset').expect(StatusCodes.OK);
    });

    it('should reset scores for a specific game when invalid', async () => {
        gameInfo.resetHighScores.rejects();
        return supertest(expressApp).patch('/api/game/scores/0/reset').expect(StatusCodes.NOT_FOUND);
    });

    it('should send 503 when reset high scores fails', async () => {
        gameInfo.resetHighScores.resolves().returns(Promise.resolve(null));
        return supertest(expressApp).patch('/api/game/scores/0/reset').expect(StatusCodes.SERVICE_UNAVAILABLE);
    });

    it('should reset scores for all games when valid', async () => {
        gameInfo.resetAllHighScores.resolves();
        return supertest(expressApp).patch('/api/game/scores/reset').expect(StatusCodes.OK);
    });

    it('should send 503 when resetting the scores fails', async () => {
        gameInfo.resetAllHighScores.resolves().returns(Promise.resolve(null));
        return supertest(expressApp).patch('/api/game/scores/reset').expect(StatusCodes.SERVICE_UNAVAILABLE);
    });

    it('should reset scores for all games when invalid', async () => {
        gameInfo.resetAllHighScores.rejects();
        return supertest(expressApp).patch('/api/game/scores/reset').expect(StatusCodes.BAD_REQUEST);
    });

    it('should return 503 when getting an error trying to delete a card', async () => {
        gameInfo.deleteGameInfoById.resolves().returns(Promise.resolve(null));
        return supertest(expressApp).delete('/api/game/cards/0').expect(StatusCodes.SERVICE_UNAVAILABLE);
    });

    it("should return 503 when there's an error deleting all games", async () => {
        gameInfo.deleteAllGamesInfo.resolves().returns(Promise.resolve(null));
        return supertest(expressApp).delete('/api/game/cards').expect(StatusCodes.SERVICE_UNAVAILABLE);
    });

    it('should return 503 when there is and error getting the cards', async () => {
        gameInfo.getGamesInfo.resolves().returns(Promise.resolve(null));
        return supertest(expressApp).get('/api/game/cards?page=1').expect(StatusCodes.SERVICE_UNAVAILABLE);
    });

    it('should return 503 when there is an error posting a new game', async () => {
        gameInfo.addGameInfoWrapper.resolves().returns(Promise.resolve(null));
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
            name: 'test',
        };
        return supertest(expressApp).post('/api/game/card').send(expectedBody).expect(StatusCodes.SERVICE_UNAVAILABLE);
    });

    it('should return Not Acceptable if the game creation has a problem', async () => {
        const expectedIsValid = true;
        gameValidation.isNbDifferenceValid.resolves(expectedIsValid);
        gameInfo.addGameInfoWrapper.rejects();
        const expectedBody = {
            original: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            modify: { width: 2, height: 2, data: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
            differenceRadius: 0,
            name: 'test',
        };
        return supertest(expressApp).post('/api/game/card').send(expectedBody).expect(StatusCodes.NOT_ACCEPTABLE);
    });
});
