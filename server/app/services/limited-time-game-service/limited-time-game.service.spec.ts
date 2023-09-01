import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { LimitedTimeGame } from './limited-time-game.service';
import { stub } from 'sinon';
import { expect } from 'chai';
import { PrivateGameInformation } from '@app/interface/game-info';
import { Container } from 'typedi';

describe('LimitedTimeGameService', () => {
    let limitedTimeGameService: LimitedTimeGame;
    let gameInfoService: GameInfoService;

    beforeEach(async () => {
        limitedTimeGameService = Container.get(LimitedTimeGame);
        gameInfoService = Container.get(GameInfoService);
    });

    it('should generate games', () => {
        const test = stub(gameInfoService, 'getAllGameInfos').callsFake(async () => {
            return Promise.resolve([] as PrivateGameInformation[]);
        });

        limitedTimeGameService.generateGames();
        expect(test.called).to.equal(true);
    });

    it('should return the games to play', () => {
        limitedTimeGameService.gamesShuffled = new Map();
        limitedTimeGameService.gamesShuffled.set('1', []);
        expect(limitedTimeGameService.getGamesToPlay('1')).to.deep.equal([]);
    });

    it('should shuffle an array', () => {
        const arrayStart = [{ id: '1' }, { id: '2' }, { id: '3' }] as PrivateGameInformation[];
        const arrayEnd = limitedTimeGameService['shuffle'](arrayStart);

        expect(arrayEnd).to.not.equal([{ id: '1' }, { id: '2' }, { id: '3' }] as PrivateGameInformation[]);
    });

    it('should delete a game', () => {
        const arrayStart = [{ id: '1' }, { id: '2' }, { id: '3' }] as PrivateGameInformation[];
        limitedTimeGameService.gamesShuffled = new Map();
        limitedTimeGameService.gamesShuffled.set('1', arrayStart);

        limitedTimeGameService.deleteGame('1');
        expect(limitedTimeGameService.gamesShuffled.get('1')?.length).to.equal(2);
    });

    it('should delete all games', () => {
        const arrayStart = [{ id: '1' }, { id: '2' }, { id: '3' }] as PrivateGameInformation[];
        limitedTimeGameService.gamesShuffled = new Map();
        limitedTimeGameService.gamesShuffled.set('1', arrayStart);

        limitedTimeGameService.deleteAllGames();
        expect(limitedTimeGameService.gamesShuffled.get('1')?.length).to.equal(0);
    });
});
