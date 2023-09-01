import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { GameCardButtonsComponent } from '@app/components/game-card-buttons/game-card-buttons.component';
import { GameScoreComponent } from '@app/components/game-score/game-score.component';
import { gameCard1 } from '@app/constants/game-card-constant.spec';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { GameCardComponent } from './game-card.component';

describe('GameCardComponent', () => {
    let component: GameCardComponent;
    let fixture: ComponentFixture<GameCardComponent>;
    let spyTimeFormatter: jasmine.SpyObj<TimeFormatterService>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;

    let socketServiceMock: CommunicationSocketService;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['getImgData']);
        spyCommunicationService.getImgData.and.returnValue(of());
        spyTimeFormatter = jasmine.createSpyObj('TimeFormatterService', ['formatTime']);
        socketHelper = new SocketTestHelper();
        socketServiceMock = new CommunicationSocketService();
        socketServiceMock['socket'] = socketHelper as unknown as Socket;

        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, RouterTestingModule, HttpClientModule],
            declarations: [GameCardComponent, GameScoreComponent, GameCardButtonsComponent],
            providers: [
                {
                    provide: CommunicationService,
                    useValue: spyCommunicationService,
                },
                {
                    provide: CommunicationSocketService,
                    useValue: socketServiceMock,
                },
                {
                    provide: TimeFormatterService,
                    useValue: spyTimeFormatter,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCardComponent);
        component = fixture.componentInstance;
        component.gameCard = gameCard1;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the base64 image name', () => {
        expect(component.imageSrc).toEqual(gameCard1.gameInformation.thumbnail);
    });

    it('formatScoreTime should call getMMSSFormat from timerFormatter class', () => {
        component.formatScoreTime(1);
        expect(spyTimeFormatter.formatTime).toHaveBeenCalled();
    });

    it('getGameName should return the name of the game', () => {
        expect(component.getGameName()).toEqual('test');
    });

    it('isAdminCard should return true if the card is in admin mode', () => {
        expect(component.isAdminCard()).toEqual(true);
    });

    it('getMultiplayerScores should return the multiplayer scores for a given game', () => {
        const scores = component.getMultiplayerScores();
        expect(scores).toBeDefined();
        expect(scores.length).toEqual(3);
    });

    it('getSinglePlayerScores should return the single player scores for a given game', () => {
        const scores = component.getSinglePlayerScores();
        expect(scores).toBeDefined();
        expect(scores.length).toEqual(3);
    });

    it('hasMultiplayerScores should return true if the game has a multiplayer score', () => {
        expect(component.hasMultiplayerScores()).toEqual(true);
    });

    it('hasSinglePlayerScores should return true if the game has a single player score', () => {
        expect(component.hasSinglePlayerScores()).toEqual(true);
    });

    it('should get all the games waiting for opponent', () => {
        socketHelper.peerSideEmit(SocketEvent.GetGamesWaiting, { mode: GameMode.Classic, gamesWaiting: ['1', '2'] });
        component.ngOnInit();
        expect(gameCard1.isMulti).toEqual(true);
    });
});
