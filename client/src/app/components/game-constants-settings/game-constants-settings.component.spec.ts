import { HttpClient, HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameConstantFieldComponent } from '@app/components/game-constant-field/game-constant-field.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameTimeConstants } from '@common/game-time-constants';
import { of } from 'rxjs';

import { AngularFireModule } from '@angular/fire/compat';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { GameConstantsSettingsComponent } from './game-constants-settings.component';

describe('GameConstantsSettingsComponent', () => {
    let component: GameConstantsSettingsComponent;
    let fixture: ComponentFixture<GameConstantsSettingsComponent>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;

    beforeEach(async () => {
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['setGameTimeConstants', 'getGameTimeConstants']);
        await TestBed.configureTestingModule({
            declarations: [GameConstantsSettingsComponent, GameConstantFieldComponent],
            providers: [{ provide: CommunicationService, useValue: spyCommunicationService }],
            imports: [
                AppMaterialModule,
                HttpClientModule,
                AngularFireModule.initializeApp(environment.firebase),

                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameConstantsSettingsComponent);
        component = fixture.componentInstance;

        spyCommunicationService.getGameTimeConstants.and.callFake(() => {
            return of({ body: { gameTime: 2, penaltyTime: 2, successTime: 2 } } as HttpResponse<GameTimeConstants>);
        });

        spyCommunicationService.setGameTimeConstants.and.callFake(() => {
            return of();
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should restore the to the default values', () => {
        component.onClickRestoreDefaultValues();
        const expectedGameTime = 30;
        const expectedPenaltyTime = 5;
        const expectedSuccessTime = 5;
        expect(component.gameTimeConstants.gameTime).toBe(expectedGameTime);
        expect(component.gameTimeConstants.penaltyTime).toBe(expectedPenaltyTime);
        expect(component.gameTimeConstants.successTime).toBe(expectedSuccessTime);
    });

    it('should set the game time constants', () => {
        component.setGameTimeConstants();
        expect(spyCommunicationService.setGameTimeConstants).toHaveBeenCalled();
    });

    it('should get the game time constants', () => {
        component.getConstants();
        const expectedGameTime = 2;
        const expectedPenaltyTime = 2;
        const expectedSuccessTime = 2;
        expect(component.gameTimeConstants.gameTime).toBe(expectedGameTime);
        expect(component.gameTimeConstants.penaltyTime).toBe(expectedPenaltyTime);
        expect(component.gameTimeConstants.successTime).toBe(expectedSuccessTime);
    });

    it('should check if the values are the default values', () => {
        expect(component.isDefaultValues()).toBeFalsy();
        component.gameTimeConstants.gameTime = 30;
        component.gameTimeConstants.penaltyTime = 5;
        component.gameTimeConstants.successTime = 5;
        expect(component.isDefaultValues()).toBeTruthy();
    });
});
