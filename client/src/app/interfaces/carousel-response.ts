import { PublicGameInformation } from '@common/game-information';
import { CarouselInformation } from '@common/carousel-information';

export interface CarouselResponse {
    games: PublicGameInformation[];
    carouselInfo: CarouselInformation;
}
