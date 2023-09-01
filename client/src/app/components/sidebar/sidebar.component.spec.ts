import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CluesAreaComponent } from '@app/components/clues-area/clues-area.component';
import { DifferencesAreaComponent } from '@app/components/differences-area/differences-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { TimerStopwatchComponent } from '@app/components/timer-stopwatch/timer-stopwatch.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { ScoreType } from '@common/score-type';
import { Subject } from 'rxjs';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let spyGameInfosService: jasmine.SpyObj<GameInformationHandlerService>;
    let spyDifferencesDetection: jasmine.SpyObj<DifferencesDetectionHandlerService>;

    beforeEach(async () => {
        const expectedTotalDifference = 10;
        spyGameInfosService = jasmine.createSpyObj(
            'GameInformationHandlerService',
            [
                'getGameName',
                'getGameMode',
                'getPlayer',
                'getOpponent',
                'getNbDifferences',
                'getNbTotalDifferences',
                'isLimitedTime',
                'isClassic',
                'getConstants',
            ],
            { $newGame: new Subject<void>(), $differenceFound: new Subject<string>() },
        );
        spyDifferencesDetection = jasmine.createSpyObj('DifferencesDetectionHandlerService', ['nbDifferencesFound', 'resetNumberDifferencesFound']);
        spyGameInfosService.getPlayer.and.callFake(() => {
            return { name: 'test', nbDifferences: 0 };
        });
        spyGameInfosService.getOpponent.and.callFake(() => {
            return { name: 'test2', nbDifferences: 0 };
        });
        spyGameInfosService.getNbDifferences.and.callFake(() => 0);
        spyGameInfosService.getNbTotalDifferences.and.callFake(() => expectedTotalDifference);
        spyGameInfosService.gameTimeConstants = { gameTime: 30, penaltyTime: 3, successTime: 3 };
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent, DifferencesAreaComponent, TimerStopwatchComponent, CluesAreaComponent],
            imports: [AppMaterialModule, HttpClientTestingModule],
            providers: [
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInfosService,
                },
                {
                    provide: DifferencesDetectionHandlerService,
                    useValue: spyDifferencesDetection,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyGameInfosService.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'imageName',
            idEditedBmp: '1',
            soloScore: [
                {
                    playerName: 'test2',
                    time: 10,
                    type: ScoreType.Default,
                },
                {
                    playerName: 'test',
                    time: 10,
                    type: ScoreType.Default,
                },
            ],
            multiplayerScore: [
                {
                    playerName: 'test2',
                    time: 10,
                    type: ScoreType.Default,
                },
                {
                    playerName: 'test',
                    time: 10,
                    type: ScoreType.Default,
                },
            ],
            nbDifferences: 10,
            isMulti: false,
        };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set new game values', () => {
        component.gameName = 'test';
        spyGameInfosService.$newGame.subscribe(() => {
            expect(component.gameName).not.toEqual('test');
        });
        spyGameInfosService.$newGame.next();
    });
});
