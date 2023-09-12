import { Coordinate } from '@common/coordinate';
import { Score } from '@common/score';

export interface PrivateGameInformation {
    id: string;
    name: string;
    idOriginalBmp: string;
    idEditedBmp: string;
    thumbnail: string;
    soloScore: Score[];
    multiplayerScore: Score[];
    differenceRadius: number;
    differences: Coordinate[][];
}
