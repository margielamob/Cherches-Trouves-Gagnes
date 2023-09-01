import {PublicGameInformation} from './game-information'

export interface GameId {
    gameId : string;
    gameCard? : PublicGameInformation
}