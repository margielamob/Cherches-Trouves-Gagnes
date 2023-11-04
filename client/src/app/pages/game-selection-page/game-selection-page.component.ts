import { Component } from '@angular/core';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent {
    constructor(readonly gameCarouselService: GameCarouselService) {}

    getNumberOfGames(): number {
        return this.gameCarouselService.getNumberOfCards();
    }

    hasGames(): boolean {
        return this.gameCarouselService.hasCards();
    }
}
