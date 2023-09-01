import { Service } from 'typedi';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { Score } from '@common/score';

const ARRAY_SIZE = 3;

@Service()
export class ScoresHandlerService {
    private soloScores: Score[] = [];
    private multiScores: Score[] = [];

    constructor(private readonly gameInfoService: GameInfoService) {}

    async verifyScore(gameId: string, score: Score, isMulti: boolean): Promise<number> {
        await this.getScores(gameId);

        const index = this.tryAddScore(score, isMulti ? this.multiScores : this.soloScores);
        await this.gameInfoService.updateHighScores(gameId, this.trimArrayToSize(this.soloScores), this.trimArrayToSize(this.multiScores));

        this.clearScores();
        return index;
    }

    private async getScores(gameId: string): Promise<void> {
        const scores = (await this.gameInfoService.getHighScores(gameId)) as { soloScore: Score[]; multiplayerScore: Score[] };
        this.soloScores = scores.soloScore;
        this.multiScores = scores.multiplayerScore;
    }

    private tryAddScore(score: Score, scores: Score[]): number {
        if (scores.length === 0) {
            scores.push(score);
            return 1;
        }

        let index = scores.findIndex((s) => s.time > score.time);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- findIndex returns -1 if no element is found
        if (index === -1) {
            scores.push(score);
            index = scores.length - 1;
        } else {
            scores.splice(index, 0, score);
        }

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- -1 if no score is added
        return index > 2 ? -1 : index + 1;
    }

    private clearScores(): void {
        this.soloScores = [];
        this.multiScores = [];
    }

    private trimArrayToSize(array: Score[]): Score[] {
        if (array.length > ARRAY_SIZE) {
            array.splice(ARRAY_SIZE);
        }
        return array;
    }
}
