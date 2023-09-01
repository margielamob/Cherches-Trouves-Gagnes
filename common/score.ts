import { ScoreType } from './score-type';
export interface Score {
    playerName: string;
    time: number;
    type: ScoreType;
}
