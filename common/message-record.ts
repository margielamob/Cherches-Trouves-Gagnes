import { GameRecord } from './game-record';

export interface MessageRecord {
    record: GameRecord;
    playerName: string;
    gameName: string;
    isMulti: boolean;
}