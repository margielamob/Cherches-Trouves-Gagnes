import { Injectable } from '@angular/core';
import { CarouselInformation } from '@common/carousel-information';

@Injectable({
    providedIn: 'root',
})
export class GameCarouselService {
    carouselInformation: CarouselInformation = {
        currentPage: 0,
        gamesOnPage: 0,
        nbOfGames: 0,
        nbOfPages: 0,
        hasNext: false,
        hasPrevious: false,
    };

    setCarouselInformation(carouselInfo: CarouselInformation): void {
        this.carouselInformation = carouselInfo;
    }

    getNumberOfCards(): number {
        return this.carouselInformation.nbOfGames;
    }

    hasMoreThanOneCard(): boolean {
        return this.carouselInformation.nbOfGames > 1;
    }

    hasCards(): boolean {
        return this.carouselInformation.nbOfGames > 0;
    }

    hasPreviousCards(): boolean {
        return this.carouselInformation.hasPrevious;
    }

    hasNextCards(): boolean {
        return this.carouselInformation.hasNext;
    }
}
