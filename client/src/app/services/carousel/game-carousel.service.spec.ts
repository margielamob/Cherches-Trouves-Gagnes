import { TestBed } from '@angular/core/testing';
import { CarouselInformation } from '@common/carousel-information';
import { GameCarouselService } from './game-carousel.service';

describe('GameCarouselService', () => {
    let service: GameCarouselService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameCarouselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the carousel information attribute', () => {
        service.setCarouselInformation({} as CarouselInformation);
        expect(service.carouselInformation).toEqual({} as CarouselInformation);
    });

    it('should get the number of cards in the carousel', () => {
        service.getNumberOfCards();
        expect(service.getNumberOfCards()).toEqual(0);
        service.carouselInformation.nbOfGames = 1;
        expect(service.getNumberOfCards()).toEqual(1);
    });

    it('should return true if there is more than one card in the carousel', () => {
        service.hasMoreThanOneCard();
        expect(service.hasMoreThanOneCard()).toEqual(false);
        service.carouselInformation.nbOfGames = 1;
        expect(service.hasMoreThanOneCard()).toEqual(false);
        service.carouselInformation.nbOfGames = 2;
        expect(service.hasMoreThanOneCard()).toEqual(true);
    });

    it('should return true if there is at least one card in the carousel', () => {
        service.hasCards();
        expect(service.hasCards()).toEqual(false);
        service.carouselInformation.nbOfGames = 1;
        expect(service.hasCards()).toEqual(true);
    });

    it('should return true if there is a previous page of cards', () => {
        service.hasPreviousCards();
        expect(service.hasPreviousCards()).toEqual(false);
        service.carouselInformation.hasPrevious = true;
        expect(service.hasPreviousCards()).toEqual(true);
    });

    it('should return true if there is a next page of cards', () => {
        service.hasNextCards();
        expect(service.hasNextCards()).toEqual(false);
        service.carouselInformation.hasNext = true;
        expect(service.hasNextCards()).toEqual(true);
    });
});
