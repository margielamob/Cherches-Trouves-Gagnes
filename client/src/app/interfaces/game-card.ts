import { PublicGameInformation } from '@common/game-information';

export interface GameCard {
    gameInformation: PublicGameInformation;
    isAdminCard: boolean;
    isMulti: boolean;
}
