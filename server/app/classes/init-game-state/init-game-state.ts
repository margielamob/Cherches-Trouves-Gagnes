import { GameState } from '@app/classes/game-state/game-state';
import { InitTimerState } from '@app/classes/init-timer-state/init-timer-state';
import { GameStatus } from '@app/enum/game-status';

export class InitGameState extends GameState {
    // eslint-disable-next-line no-unused-vars -- need multi elsewhere
    next(isMulti: boolean) {
        this.context.transitionTo(new InitTimerState());
    }

    status(): GameStatus {
        return GameStatus.InitGame;
    }
}
