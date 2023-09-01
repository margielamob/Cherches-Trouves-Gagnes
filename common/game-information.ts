import { Score } from './score';

export interface PublicGameInformation {
    id: string;
    name: string;
    thumbnail: string;
    idOriginalBmp: string;
    idEditedBmp: string;
    soloScore: Score[];
    multiplayerScore: Score[];
    nbDifferences: number;
    isMulti : boolean;
}
