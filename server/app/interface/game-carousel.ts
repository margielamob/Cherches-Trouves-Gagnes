import { CarouselInformation } from '@common/carousel-information';
import { PrivateGameInformation } from '@app/interface/game-info';

export interface GameCarousel {
    games: PrivateGameInformation[];
    information: CarouselInformation;
}
