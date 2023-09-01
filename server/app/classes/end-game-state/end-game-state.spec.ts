import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { GameMode } from '@common/game-mode';
import { expect } from 'chai';
import { SinonSpiedInstance, spy } from 'sinon';

describe('EndGame', () => {
    let state: EndGameState;
    let gameContextSpyObj: SinonSpiedInstance<GameContext>;
    let gameContext: GameContext;

    beforeEach(() => {
        state = new EndGameState();
        gameContext = new GameContext(GameMode.Classic, state, true);
        gameContextSpyObj = spy(gameContext);
        state.setContext(gameContext);
    });

    it('should get a status', () => {
        expect(state.status()).to.equal('EndGame');
    });

    it('should go to the next state', () => {
        state.next(true);
        expect(gameContextSpyObj.transitionTo.called).to.equal(false);
        state.next(false);
        expect(gameContextSpyObj.transitionTo.calledTwice).to.equal(false);
    });
});
