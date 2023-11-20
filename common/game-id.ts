import { Coordinate } from './coordinate';
import { PublicGameInformation } from './game-information';
import { User } from './user';

export interface GameId {
    gameId: string;
    gameCard?: PublicGameInformation;
    data?: { coords: Coordinate[][]; nbDifferencesLeft: number; players?: User[] };
}
