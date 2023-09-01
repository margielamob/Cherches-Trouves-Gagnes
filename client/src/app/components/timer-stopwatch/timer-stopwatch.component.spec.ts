import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { SocketEvent } from '@common/socket-event';
import { Socket } from 'socket.io-client';
import { TimerStopwatchComponent } from './timer-stopwatch.component';

describe('TimerStopwatchComponent', () => {
    let component: TimerStopwatchComponent;
    let fixture: ComponentFixture<TimerStopwatchComponent>;

    let socketServiceMock: CommunicationSocketService;
    let socketHelper: SocketTestHelper;
    let spyGameInfosService: jasmine.SpyObj<GameInformationHandlerService>;
    let spyTimeFormatter: jasmine.SpyObj<TimeFormatterService>;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new CommunicationSocketService();
        socketServiceMock['socket'] = socketHelper as unknown as Socket;
        spyTimeFormatter = jasmine.createSpyObj('TimeFormatterService', ['formatTime']);
        spyGameInfosService = jasmine.createSpyObj('GameInformationHandlerService', ['getConstants', 'isClassic', 'isLimitedTime']);

        await TestBed.configureTestingModule({
            declarations: [TimerStopwatchComponent],
            imports: [AppMaterialModule, RouterTestingModule, HttpClientModule],
            providers: [
                { provide: CommunicationSocketService, useValue: socketServiceMock },
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInfosService,
                },
                {
                    provide: TimeFormatterService,
                    useValue: spyTimeFormatter,
                },
            ],
        }).compileComponents();

        spyGameInfosService.gameTimeConstants = { gameTime: 30, penaltyTime: 3, successTime: 3 };
        fixture = TestBed.createComponent(TimerStopwatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should set the display time', () => {
        socketHelper.peerSideEmit(SocketEvent.Clock, '2');
        component.ngOnInit();

        expect(spyTimeFormatter.formatTime).toHaveBeenCalled();
    });

    it('should display time on init temps limite', () => {
        spyGameInfosService.isClassic.and.callFake(() => false);
        spyGameInfosService.isLimitedTime.and.callFake(() => true);
        spyTimeFormatter.formatTime.and.callFake(() => '30:00');
        const newComponent = new TimerStopwatchComponent(socketServiceMock, spyTimeFormatter, spyGameInfosService);

        expect(spyTimeFormatter.formatTime).toHaveBeenCalled();
        expect(newComponent.timerDisplay).toBe('30:00');
    });

    it('should display time on init classic', () => {
        spyGameInfosService.isClassic.and.callFake(() => true);

        spyTimeFormatter.formatTime.and.callFake(() => '00:00');
        const newComponent = new TimerStopwatchComponent(socketServiceMock, spyTimeFormatter, spyGameInfosService);

        expect(spyTimeFormatter.formatTime).toHaveBeenCalled();
        expect(newComponent.timerDisplay).toBe('00:00');
    });

    it('should return true is animation is needed', () => {
        spyGameInfosService.isLimitedTime.and.callFake(() => true);
        component['time'] = 5;
        expect(component.needFeedbackAnimation()).toBeTrue();
    });
});
