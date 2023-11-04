import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DialogLimitedTimeComponent } from './dialog-limited-time.component';

describe('DialogLimitedTimeComponent', () => {
    let component: DialogLimitedTimeComponent;
    let fixture: ComponentFixture<DialogLimitedTimeComponent>;
    let gameInformationHandlerService: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(async () => {
        gameInformationHandlerService = jasmine.createSpyObj('GameInformationHandlerService', [
            'setPlayerName',
            'getPlayer',
            'handleSocketEvent',
            'getConstants',
        ]);
        gameInformationHandlerService.players = [{ name: '', nbDifferences: 2 }];
        gameInformationHandlerService.gameMode = GameMode.LimitedTime;
        await TestBed.configureTestingModule({
            declarations: [DialogLimitedTimeComponent],
            imports: [
                AppMaterialModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            providers: [{ provide: GameInformationHandlerService, useValue: gameInformationHandlerService }],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogLimitedTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should send Socket Event and handle socket on click solo', () => {
        spyOn(component, 'noGameAvailable').and.callFake(() => false);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spySocket = spyOn(component['communicationSocketService'], 'send').and.callFake(() => {});
        component.onClickSolo();
        expect(spySocket).toHaveBeenCalled();
        expect(gameInformationHandlerService.handleSocketEvent).toHaveBeenCalled();
    });

    it('should not send Socket Event and handle socket on click solo if no game available', () => {
        spyOn(component, 'noGameAvailable').and.callFake(() => true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spySocket = spyOn(component['communicationSocketService'], 'send').and.callFake(() => {});
        component.onClickSolo();
        expect(spySocket).not.toHaveBeenCalled();
        expect(gameInformationHandlerService.handleSocketEvent).not.toHaveBeenCalled();
    });

    it('should send Socket Event and handle socket on click coop', () => {
        spyOn(component, 'noGameAvailable').and.callFake(() => false);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spySocket = spyOn(component['communicationSocketService'], 'send').and.callFake(() => {});
        component.onClickCoop();
        expect(spySocket).toHaveBeenCalled();
        expect(gameInformationHandlerService.handleSocketEvent).toHaveBeenCalled();
    });

    it('should not send Socket Event and handle socket on click coop if no game available', () => {
        spyOn(component, 'noGameAvailable').and.callFake(() => true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spySocket = spyOn(component['communicationSocketService'], 'send').and.callFake(() => {});
        component.onClickCoop();
        expect(spySocket).not.toHaveBeenCalled();
        expect(gameInformationHandlerService.handleSocketEvent).not.toHaveBeenCalled();
    });

    it('should return false if game are available ', () => {
        spyOn(component['gameCarouselService'], 'getNumberOfCards').and.callFake(() => 1);
        expect(component.noGameAvailable()).toEqual(false);
    });

    it('should return true if no game are available ', () => {
        spyOn(component['gameCarouselService'], 'getNumberOfCards').and.callFake(() => 0);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyOpenSnackBar = spyOn(component, 'openSnackBar').and.callFake(() => {});
        expect(component.noGameAvailable()).toEqual(true);
        expect(spyOpenSnackBar).toHaveBeenCalled();
    });

    it('should open snackbar', () => {
        const spySnackBar = spyOn(component['snackBar'], 'openFromComponent').and.resolveTo();

        component.openSnackBar();
        expect(spySnackBar).toHaveBeenCalled();
    });
});
