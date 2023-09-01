import { Injectable } from '@angular/core';
import { GameMode } from '@common/game-mode';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Injectable({
    providedIn: 'root',
})
export class MainPageService {
    constructor(private readonly gameInformationHandlerService: GameInformationHandlerService) {}

    setGameMode(gameMode: GameMode): void {
        this.gameInformationHandlerService.setGameMode(gameMode);
    }
}
