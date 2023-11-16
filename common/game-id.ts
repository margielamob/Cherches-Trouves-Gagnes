import { Coordinate } from './coordinate';
import { PublicGameInformation } from './game-information';

export interface GameId {
    gameId: string;
    gameCard?: PublicGameInformation;
    data?: { coords: Coordinate[][]; nbDifferencesLeft: number };
}
