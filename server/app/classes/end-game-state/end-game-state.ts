import { GameState } from '@app/classes/game-state/game-state';
import { GameStatus } from '@app/enum/game-status';

export class EndGameState extends GameState {
    // eslint-disable-next-line no-unused-vars -- need multi elsewhere
    next(isMulti: boolean): void {
        return;
    }

    status(): GameStatus {
        return GameStatus.EndGame;
    }
}
