import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameState } from '@app/classes/game-state/game-state';
import { GameStatus } from '@app/enum/game-status';

export class FindDifferenceState extends GameState {
    // eslint-disable-next-line  -- need multi elsewhere
    next(isMulti: boolean) {
        this.context.transitionTo(new EndGameState());
    }

    status(): GameStatus {
        return GameStatus.FindDifference;
    }
}
