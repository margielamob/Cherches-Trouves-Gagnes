import { GameCard } from '@app/interfaces/game-card';
import { ScoreType } from '@common/score-type';

export const gameCard1: GameCard = {
    gameInformation: {
        id: '1',
        name: 'test',
        idOriginalBmp: 'imageName',
        idEditedBmp: '1',
        thumbnail: 'image',
        soloScore: [
            {
                playerName: 'test2',
                time: 10,
                type: ScoreType.Player,
            },
            {
                playerName: 'test',
                time: 10,
                type: ScoreType.Player,
            },
        ],
        multiplayerScore: [
            {
                playerName: 'test2',
                time: 10,
                type: ScoreType.Player,
            },
            {
                playerName: 'test',
                time: 10,
                type: ScoreType.Player,
            },
        ],
        nbDifferences: 1,
        isMulti: true,
    },
    isAdminCard: true,
    isMulti: true,
};
