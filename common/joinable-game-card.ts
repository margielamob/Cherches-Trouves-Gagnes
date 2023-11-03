import { PublicGameInformation } from './game-information';
import { User } from './user';

export interface JoinableGameCard {
    players: User[];
    nbDifferences: number;
    thumbnail: string;
    roomId: string;
    gameInformation: PublicGameInformation;
}
