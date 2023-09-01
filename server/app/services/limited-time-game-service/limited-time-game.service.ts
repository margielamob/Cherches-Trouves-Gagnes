import { PrivateGameInformation } from '@app/interface/game-info';
import { Service } from 'typedi';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';

@Service()
export class LimitedTimeGame {
    gamesShuffled: Map<string, PrivateGameInformation[]> = new Map();

    constructor(private readonly gameInfoService: GameInfoService) {}

    getGamesToPlay(gameId: string) {
        return this.gamesShuffled.get(gameId);
    }

    async generateGames() {
        const allGames = (await this.gameInfoService.getAllGameInfos()) as PrivateGameInformation[];
        return this.shuffle(allGames);
    }

    deleteGame(gameId: string) {
        this.gamesShuffled.forEach((value, key) => {
            for (let i = 0; i < value.length; i++) {
                if (value[i].id === gameId) {
                    value.splice(i, 1);
                }
            }
            this.gamesShuffled.set(key, value);
        });
    }

    deleteAllGames() {
        this.gamesShuffled.forEach((value, key) => {
            this.gamesShuffled.set(key, [] as PrivateGameInformation[]);
        });
    }
    private shuffle(array: PrivateGameInformation[]) {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}
