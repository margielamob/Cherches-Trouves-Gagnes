import { TestBed } from '@angular/core/testing';
import { GameMode } from '@common/game-mode';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

import { MainPageService } from './main-page.service';

describe('MainPageService', () => {
    let service: MainPageService;
    let spyGameInformationHandlerService: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(() => {
        spyGameInformationHandlerService = jasmine.createSpyObj('GameInformationHandlerService', ['setGameMode']);
        TestBed.configureTestingModule({
            providers: [{ provide: GameInformationHandlerService, useValue: spyGameInformationHandlerService }],
        });
        service = TestBed.inject(MainPageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the game mode', () => {
        service.setGameMode(GameMode.Classic);
        expect(spyGameInformationHandlerService.setGameMode).toHaveBeenCalledWith(GameMode.Classic);
    });
});
