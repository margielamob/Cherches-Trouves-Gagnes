import { Game } from '@app/classes/game/game';
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { GameTimeConstantService } from '@app/services/game-time-constant/game-time-constants.service';
import { GameMode } from '@common/game-mode';
import { GameTimeConstants } from '@common/game-time-constants';
import { Service } from 'typedi';

@Service()
export class TimerService {
    private timerConstant: Map<string, GameTimeConstants>;
    private initialTime: Map<string, Date>;

    constructor(private differences: DifferenceService, private timeConstant: GameTimeConstantService) {
        this.timerConstant = new Map();
        this.initialTime = new Map();
    }

    seconds(game: Game) {
        return this.calculateTime(game);
    }

    async setTimerConstant(gameId: string) {
        this.timerConstant.set(gameId, await this.timeConstant.getGameTimeConstant());
    }

    setTimer(game: Game) {
        this.initialTime.set(game.identifier, new Date());
        game.next();
    }

    private gameTime(gameId: string) {
        const constant = this.timerConstant.get(gameId);
        const init = this.initialTime.get(gameId);
        return !constant || !init ? null : { constant, init };
    }

    private calculateLimitedGameTimer(game: Game): number {
        const presentTime = new Date();
        const time = this.gameTime(game.identifier);
        const totalDifferenceFound = this.differences.totalDifferenceFound(game.identifier);
        if (!time || !totalDifferenceFound) {
            return 0;
        }
        let timer =
            time.constant.gameTime -
            /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 ms in 1 second */
            Math.floor((presentTime.getTime() - time.init.getTime()) / 1000) +
            time.constant.successTime * totalDifferenceFound.size -
            time.constant.penaltyTime * game.nbCluesAsked;
        if (timer > 120) {
            const differenceLimitTime = timer - 120;
            time.init.setTime(time.init.getTime() - differenceLimitTime * 1000);
            timer -= differenceLimitTime;
        }
        return timer < 0 ? 0 : timer;
    }

    private calculateTime(game: Game): number {
        const presentTime = new Date();
        const time = this.initialTime.get(game.identifier);
        const timer = this.gameTime(game.identifier);
        if (!time || !timer) {
            return 0;
        }
        if (game.gameMode === GameMode.Classic) {
            /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 ms in 1 second */
            return Math.floor((presentTime.getTime() - time.getTime()) / 1000) + timer.constant.penaltyTime * game.nbCluesAsked;
        } else {
            const limitedTime = this.calculateLimitedGameTimer(game);
            if (limitedTime === 0) {
                game.setEndgame();
            }
            return limitedTime;
        }
    }
}
