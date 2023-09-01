import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { GameStatus } from '@app/enum/game-status';

export abstract class GameState {
    context: GameContext;

    setContext(context: GameContext) {
        this.context = context;
    }

    end(): void {
        this.context.transitionTo(new EndGameState());
    }

    abstract next(isMulti: boolean): void;
    abstract status(): GameStatus;
}
