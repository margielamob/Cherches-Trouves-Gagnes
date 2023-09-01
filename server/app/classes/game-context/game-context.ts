import { GameState } from '@app/classes/game-state/game-state';
import { GameMode } from '@common/game-mode';
import { GameStatus } from '@app/enum/game-status';

export class GameContext {
    private state: GameState;
    private mode: GameMode;
    private isMulti: boolean;

    constructor(mode: GameMode, state: GameState, isMulti: boolean) {
        this.state = state;
        this.state.setContext(this);
        this.mode = mode;
        this.isMulti = isMulti;
    }

    get gameMode() {
        return this.mode;
    }

    next() {
        this.state.next(this.isMulti);
    }

    end() {
        this.state.end();
    }

    transitionTo(newState: GameState) {
        this.state = newState;
        this.state.setContext(this);
    }

    gameState(): GameStatus {
        return this.state.status();
    }
}
