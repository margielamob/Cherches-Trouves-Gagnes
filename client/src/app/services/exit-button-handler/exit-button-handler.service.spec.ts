import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ExitButtonHandlerService } from './exit-button-handler.service';

describe('ExitButtonHandlerService', () => {
    let service: ExitButtonHandlerService;
    let translate: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            providers: [TranslateService],
        });
        service = TestBed.inject(ExitButtonHandlerService);
        translate = TestBed.inject(TranslateService);
        translate.use('Fr');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set CreateGame to true when on CreateGamePage', () => {
        service.setCreateGamePage();
        expect(service.currentPage.createGame).toBeTrue();
        expect(service.currentPage.game).toBeFalse();
        expect(service.currentPage.waitingRoom).toBeFalse();
    });

    it('should set Game to true when on GamePage', () => {
        service.setGamePage();
        expect(service.currentPage.game).toBeTrue();
        expect(service.currentPage.createGame).toBeFalse();
        expect(service.currentPage.waitingRoom).toBeFalse();
    });

    it('should set WaitingRoom to true when on WaitingRoom', () => {
        service.setWaitingRoom();
        expect(service.currentPage.waitingRoom).toBeTrue();
        expect(service.currentPage.createGame).toBeFalse();
        expect(service.currentPage.game).toBeFalse();
    });

    // it('should return correct title', () => {
    //     service.currentPage = { game: false, createGame: false, waitingRoom: false };
    //     expect(service.getTitle()).toEqual('');
    //     service.setGamePage();
    //     let expectedMessage = 'Quitter la partie ?';
    //     let message = service.getTitle();
    //     expect(message).toEqual(expectedMessage);

    //     service.setCreateGamePage();
    //     expectedMessage = 'Quitter la création ?';
    //     message = service.getTitle();
    //     expect(message).toEqual(expectedMessage);

    //     service.setWaitingRoom();
    //     expectedMessage = "Quitter la salle d'attente ?";
    //     message = service.getTitle();
    //     expect(message).toEqual(expectedMessage);
    // });

    // it('should return correct message', () => {
    //     service.setGamePage();
    //     let expectedMessage = 'Êtes-vous certain de vouloir quitter ? Votre progrès ne sera pas sauvegardé.';
    //     let message = service.getMessage();
    //     expect(message).toEqual(expectedMessage);

    //     service.setCreateGamePage();
    //     message = service.getMessage();
    //     expect(message).toEqual(expectedMessage);

    //     service.setWaitingRoom();
    //     expectedMessage = 'Êtes-vous certain de vouloir quitter ? Vous serez redirigés vers la page de sélection de jeu.';
    //     message = service.getMessage();
    //     expect(message).toEqual(expectedMessage);
    // });
});
