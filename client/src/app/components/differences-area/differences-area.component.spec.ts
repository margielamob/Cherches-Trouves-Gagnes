/* eslint-disable @typescript-eslint/no-magic-numbers -- tests with nb of differences */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerStopwatchComponent } from '@app/components/timer-stopwatch/timer-stopwatch.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { Subject } from 'rxjs';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DifferencesAreaComponent } from './differences-area.component';

describe('DifferencesAreaComponent', () => {
    let component: DifferencesAreaComponent;
    let fixture: ComponentFixture<DifferencesAreaComponent>;
    let spyGameInfosService: jasmine.SpyObj<GameInformationHandlerService>;
    beforeEach(async () => {
        spyGameInfosService = jasmine.createSpyObj(
            'GameInformationHandlerService',
            ['setGameInformation', 'getPlayer', 'getOpponent', 'getNbTotalDifferences', 'getNbDifferences', 'isLimitedTime', 'isClassic'],
            {
                $differenceFound: new Subject<string>(),
                $playerLeft: new Subject<string>(),
            },
        );

        spyGameInfosService.getPlayer.and.callFake(() => {
            return { name: 'test', nbDifferences: 0 };
        });

        spyGameInfosService.getNbDifferences.and.returnValue(0);
        spyGameInfosService.getNbTotalDifferences.and.returnValue(10);
        await TestBed.configureTestingModule({
            declarations: [DifferencesAreaComponent, TimerStopwatchComponent],
            imports: [
                AppMaterialModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            providers: [
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInfosService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DifferencesAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set the nb of differences found at the beginning of the game', () => {
        expect(component.players[0].nbDifference).toEqual('0');
    });

    it('should set the nb of differences found during the game', () => {
        spyGameInfosService.isClassic.and.callFake(() => true);
        component.players = [{ name: 'test', nbDifference: '0/10' }];
        spyOn(Object.getPrototypeOf(component), 'getPlayerIndex').and.callFake(() => 0);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyNbDifferenceFound = spyOn(Object.getPrototypeOf(component), 'setNbDifferencesFound').and.callFake(() => '1/10');
        spyGameInfosService.$differenceFound.subscribe(() => {
            expect(spyNbDifferenceFound).toHaveBeenCalled();
        });
        spyGameInfosService.$differenceFound.next('test');
    });

    it('should not set the nb of differences found during the game if the player is not find', () => {
        component.players = [{ name: 'test', nbDifference: '0/10' }];
        spyOn(Object.getPrototypeOf(component), 'getPlayerIndex').and.callFake(() => -1);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyNbDifferenceFound = spyOn(Object.getPrototypeOf(component), 'setNbDifferencesFound').and.callFake(() => '1/10');
        spyGameInfosService.$differenceFound.subscribe(() => {
            expect(spyNbDifferenceFound).not.toHaveBeenCalled();
        });
        spyGameInfosService.$differenceFound.next('test');
    });

    it('should not find a player and return -1 as index', () => {
        component.players = [{ name: 'test', nbDifference: '0/10' }];
        expect(component.getPlayerIndex('test2')).toEqual(-1);
        expect(component.getPlayerIndex('test')).toEqual(0);
    });

    it('should return string empty when player not found', () => {
        spyGameInfosService.getNbDifferences.and.callFake(() => undefined);
        spyGameInfosService.isClassic.and.callFake(() => true);
        expect(component.setNbDifferencesFound('')).toEqual('');
    });

    it('should return string empty when player not found', () => {
        spyGameInfosService.getNbDifferences.and.callFake(() => 1);
        spyGameInfosService.isClassic.and.callFake(() => true);
        expect(component.setNbDifferencesFound('')).toEqual('1 / 10');
    });

    it('should set nb of differences on limited and multi mode ', () => {
        spyGameInfosService.isLimitedTime.and.callFake(() => true);

        spyGameInfosService.getNbDifferences.and.callFake(() => 1);
        expect(component.setNbDifferencesFoundLimited()).toEqual('1');
    });

    it('should set nb of differences on limited and multi mode ', () => {
        spyGameInfosService.getNbDifferences.and.callFake(() => 1);

        expect(component.setNbDifferencesFoundLimited()).toEqual('1');
    });

    it('should call setNbDifferencesFoundLimited when opponent in the game', () => {
        spyGameInfosService.getOpponent.and.callFake(() => {
            return { name: 'test2', nbDifferences: 2 };
        });
        spyGameInfosService.isLimitedTime.and.callFake(() => true);
        spyGameInfosService.isMulti = true;
        const newComponent = new DifferencesAreaComponent(spyGameInfosService);
        spyOn(newComponent, 'setNbDifferencesFound').and.callFake(() => '1/10');
        expect(newComponent.players).toEqual([{ name: 'test & test2', nbDifference: '0' }]);
    });

    it('should call setNbDifferencesFoundLimited on $playerLeft.next', () => {
        spyGameInfosService.isLimitedTime.and.callFake(() => true);
        spyGameInfosService.isMulti = true;
        const newComponent = new DifferencesAreaComponent(spyGameInfosService);
        const spyNbDifferenceFound = spyOn(newComponent, 'setNbDifferencesFoundLimited').and.callFake(() => '1/10');
        spyGameInfosService.$playerLeft.subscribe(() => {
            expect(spyNbDifferenceFound).toHaveBeenCalled();
        });

        spyGameInfosService.$playerLeft.next();
    });

    it('should call setNbDifferencesFoundLimited on $differenceFound.next', () => {
        spyGameInfosService.isLimitedTime.and.callFake(() => true);
        spyGameInfosService.isMulti = true;
        const newComponent = new DifferencesAreaComponent(spyGameInfosService);
        const spyNbDifferenceFound = spyOn(newComponent, 'setNbDifferencesFoundLimited').and.callFake(() => '1/10');
        spyGameInfosService.$differenceFound.subscribe(() => {
            expect(spyNbDifferenceFound).toHaveBeenCalled();
        });

        spyGameInfosService.$differenceFound.next('test');
    });
});
