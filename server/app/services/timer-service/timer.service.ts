import { Game } from '@app/classes/game/game';
import { GameTimeConstantService } from '@app/services/game-time-constant/game-time-constants.service';
import { GameMode } from '@common/game-mode';
import { GameTimeConstants } from '@common/game-time-constants';
import { Service } from 'typedi';

@Service()
export class TimerService {
    timerConstant: Map<string, GameTimeConstants>;
    initialTime: Map<string, number>;
    timerStarted: Map<string, boolean>;
    constructor(private timeConstant: GameTimeConstantService) {
        this.timerConstant = new Map();
        this.initialTime = new Map();
        this.timerStarted = new Map();
    }

    seconds(game: Game) {
        return this.calculateTime(game);
    }

    async setTimerConstant(gameId: string) {
        this.timerConstant.set(gameId, await this.timeConstant.getGameTimeConstant());
    }

    setTimer(game: Game, initialTime: number) {
        this.initialTime.set(game.identifier, initialTime); // Store the initial timer value
        game.next();
    }

    started(gameId: string) {
        this.timerStarted.set(gameId, true);
    }
    isStartedTimer(gameId: string) {
        return this.timerStarted.get(gameId);
    }
    gameTime(gameId: string) {
        const constant = this.timerConstant.get(gameId);
        const init = this.initialTime.get(gameId);
        return !constant || !init ? null : { constant, init };
    }

    calculateLimitedGameTimer(game: Game): number {
        let timer = this.initialTime.get(game.identifier);
        if (timer === undefined || timer === null) {
            return 0;
        }

        timer--;
        this.initialTime.set(game.identifier, timer); // Update the stored timer value
        return timer;
    }

    calculateTime(game: Game): number {
        if (game.gameMode === GameMode.Classic) {
            const limitedTime = this.calculateLimitedGameTimer(game);
            if (limitedTime <= 0) {
                game.setEndgame();
            }
            return limitedTime;
        } else {
            const limitedTime = this.calculateLimitedGameTimer(game);
            if (limitedTime <= 0) {
                game.setEndgame();
            }
            return limitedTime;
        }
    }
}
