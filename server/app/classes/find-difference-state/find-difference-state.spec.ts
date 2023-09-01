import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { GameMode } from '@common/game-mode';
import { expect } from 'chai';
import { SinonSpiedInstance, spy } from 'sinon';
import { FindDifferenceState } from './find-difference-state';

describe('Find Difference State', () => {
    let state: FindDifferenceState;
    let gameContextSpyObj: SinonSpiedInstance<GameContext>;
    let gameContext: GameContext;
    beforeEach(() => {
        state = new FindDifferenceState();
        gameContext = new GameContext(GameMode.Classic, state, true);
        gameContextSpyObj = spy(gameContext);
        state.setContext(gameContext);
    });
    it('should get a status', () => {
        expect(state.status()).to.equal('FindDifference');
    });
    it('should go to the next state', () => {
        const expectedNewState = new EndGameState();
        state.next(true);
        expect(gameContextSpyObj.transitionTo.called).to.equal(true);
        expect(gameContext.gameState()).to.equal(expectedNewState.status());
    });
});
