import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { FindDifferenceState } from '@app/classes/find-difference-state/find-difference-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { GameMode } from '@common/game-mode';
import { expect } from 'chai';
import { SinonSpiedInstance, spy } from 'sinon';

describe('GameContext', () => {
    let state: FindDifferenceState;
    let stateSpyObj: SinonSpiedInstance<FindDifferenceState>;
    let gameContext: GameContext;

    beforeEach(() => {
        state = new FindDifferenceState();
        gameContext = new GameContext(GameMode.Classic, state, true);
        stateSpyObj = spy(state);
        state.setContext(gameContext);
    });

    it('should get status of the current state', () => {
        expect(gameContext.gameState()).to.equal(state.status());
    });

    it('should get the mode of the game', () => {
        expect(gameContext.gameMode).to.equal(GameMode.Classic);
    });

    it('should go to the next state', () => {
        const expectedNewState = new EndGameState();
        gameContext.next();
        expect(stateSpyObj.next.called).to.equal(true);
        expect(gameContext.gameState()).to.equal(expectedNewState.status());
    });

    it('should select a different state', () => {
        const expectedNewState = new EndGameState();
        gameContext.transitionTo(expectedNewState);
        expect(gameContext.gameState()).to.equal(expectedNewState.status());
    });
});
