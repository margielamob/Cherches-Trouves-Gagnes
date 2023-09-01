import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { GameMode } from '@common/game-mode';
import { GameStatus } from '@app/enum/game-status';
import { expect } from 'chai';
import { describe } from 'mocha';
import { GameState } from './game-state';

class MockGameState extends GameState {
    next(): void {
        return;
    }
    status(): GameStatus {
        return 'test' as GameStatus;
    }
}

describe('GameState', () => {
    let state: GameState;

    beforeEach(() => {
        state = new MockGameState();
    });

    it('should set the context', () => {
        const expectedGameContext = new GameContext(GameMode.Classic, state, true);
        state.setContext(expectedGameContext);
        expect(state.context).to.equal(expectedGameContext);
    });

    it('should end the game', () => {
        const expectedState = new EndGameState();
        const expectedGameContext = new GameContext(GameMode.Classic, state, true);
        state.setContext(expectedGameContext);
        state.end();
        expect(expectedGameContext.gameState()).to.equal(expectedState.status());
    });
});
