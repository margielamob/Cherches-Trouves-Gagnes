import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpLoaderFactory } from '@app/app.module';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { CluesAreaComponent } from '@app/components/clues-area/clues-area.component';
import { DifferencesAreaComponent } from '@app/components/differences-area/differences-area.component';
import { ExitGameButtonComponent } from '@app/components/exit-game-button/exit-game-button.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { TimerStopwatchComponent } from '@app/components/timer-stopwatch/timer-stopwatch.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { LanguageService } from '@app/services/language-service/languag.service';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { GamePageComponent } from './game-page.component';

class SocketClientServiceMock extends CommunicationSocketService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)
    override connect() {}
}

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    let languageServiceSpy: jasmine.SpyObj<LanguageService>;

    let gameInformationHandlerServiceSpy: jasmine.SpyObj<GameInformationHandlerService>;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;
    const model = {
        data: {
            win: true,
            winner: '',
            isClassic: true,
            nbPoints: 2,
        },
    };

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['createGameRoom']);
        gameInformationHandlerServiceSpy = jasmine.createSpyObj(
            'GameInformationHandlerService',
            [
                'getGameMode',
                'getGameName',
                'getPlayer',
                'getOriginalBmp',
                'getOriginalBmpId',
                'getModifiedBmpId',
                'getGameInformation',
                'getId',
                'getOpponent',
                'getNbDifferences',
                'getNbTotalDifferences',
                'setGameMode',
                'isLimitedTime',
                'isClassic',
                'getConstants',
            ],
            { $differenceFound: new Subject<string>(), $newGame: new Subject<void>(), $playerLeft: new Subject() },
        );
        gameInformationHandlerServiceSpy.getPlayer.and.callFake(() => {
            return { name: 'test', nbDifferences: 0 };
        });
        gameInformationHandlerServiceSpy.getOpponent.and.callFake(() => {
            return { name: 'test2', nbDifferences: 0 };
        });
        gameInformationHandlerServiceSpy.gameTimeConstants = { gameTime: 30, penaltyTime: 3, successTime: 3 };
        gameInformationHandlerServiceSpy.isMulti = false;
        gameInformationHandlerServiceSpy.gameMode = GameMode.Classic;
        gameInformationHandlerServiceSpy.getNbDifferences.and.callFake(() => 0);
        gameInformationHandlerServiceSpy.getNbTotalDifferences.and.callFake(() => 0);
        await TestBed.configureTestingModule({
            declarations: [
                GamePageComponent,
                SidebarComponent,
                PlayAreaComponent,
                DifferencesAreaComponent,
                ExitGameButtonComponent,
                PageHeaderComponent,
                ChatBoxComponent,
                TimerStopwatchComponent,
                CluesAreaComponent,
            ],
            imports: [
                RouterTestingModule,
                HttpClientModule,
                AppMaterialModule,
                AngularFireModule.initializeApp(environment.firebase),
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
                { provide: MatDialog, useValue: dialogSpyObj },
                { provide: CommunicationService, useValue: communicationServiceSpy },
                { provide: CommunicationSocketService, useValue: socketServiceMock },
                { provide: LanguageService, useValue: languageServiceSpy },

                { provide: MAT_DIALOG_DATA, useValue: model },
                {
                    provide: GameInformationHandlerService,
                    useValue: gameInformationHandlerServiceSpy,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should set the title', () => {
    //     expect(component.title).toEqual('Mode Classique Solo');

    //     gameInformationHandlerServiceSpy.gameMode = GameMode.LimitedTime;
    //     gameInformationHandlerServiceSpy.isMulti = true;
    //     fixture = TestBed.createComponent(GamePageComponent);
    //     component = fixture.componentInstance;
    //     expect(component.title).toEqual('Mode Temps Limité Multijoueur');
    // });

    it('should open the game over dialog when game mode is Limited time', () => {
        spyOn(Object.getPrototypeOf(component), 'findNbDifferences').and.callFake(() => 1);
        gameInformationHandlerServiceSpy.gameMode = GameMode.LimitedTime;
        component.openGameOverDialog(false);
        expect(dialogSpyObj.open).toHaveBeenCalled();

        component.openGameOverDialog(true);
        expect(dialogSpyObj.open).toHaveBeenCalled();
        expect(gameInformationHandlerServiceSpy.getNbDifferences).toHaveBeenCalled();
    });

    it('should open the game over dialog when game mode is Limited time', () => {
        spyOn(Object.getPrototypeOf(component), 'findNbDifferences').and.callFake(() => 1);
        gameInformationHandlerServiceSpy.gameMode = GameMode.LimitedTime;
        gameInformationHandlerServiceSpy.getNbDifferences.and.callFake(() => undefined);
        component.openGameOverDialog(true);
        expect(dialogSpyObj.open).toHaveBeenCalled();
        expect(gameInformationHandlerServiceSpy.getNbDifferences).toHaveBeenCalled();
    });

    it('should open the game over dialog when game mode is classic', () => {
        gameInformationHandlerServiceSpy.isClassic.and.callFake(() => true);
        component.openGameOverDialog(false);
        expect(dialogSpyObj.open).toHaveBeenCalled();
        expect(gameInformationHandlerServiceSpy.getOpponent).toHaveBeenCalled();

        component.openGameOverDialog(true);
        expect(dialogSpyObj.open).toHaveBeenCalled();
        expect(gameInformationHandlerServiceSpy.getPlayer).toHaveBeenCalled();
    });

    it('should open the game over dialog with when you win the game', () => {
        const spyOpenGameOverDialog = spyOn(component, 'openGameOverDialog');
        socketHelper.peerSideEmit(SocketEvent.Win);
        expect(spyOpenGameOverDialog).toHaveBeenCalled();
    });

    it('should open the game over dialog with when you lose the game', () => {
        const spyOpenGameOverDialog = spyOn(component, 'openGameOverDialog');
        socketHelper.peerSideEmit(SocketEvent.Lose);
        expect(spyOpenGameOverDialog).toHaveBeenCalled();
    });

    it('should open the snack bar with when player leaves time limited', () => {
        const spyOpenGameOverDialog = spyOn(component, 'openSnackBar');
        socketHelper.peerSideEmit(SocketEvent.PlayerLeft);
        expect(spyOpenGameOverDialog).toHaveBeenCalled();
    });

    it('should return nb of differences', () => {
        gameInformationHandlerServiceSpy.players = [{ name: 'test', nbDifferences: 2 }];
        expect(component['findNbDifferences']()).toEqual('2');
        gameInformationHandlerServiceSpy.players = [
            { name: 'test', nbDifferences: 2 },
            { name: 'test', nbDifferences: 3 },
        ];
        expect(component['findNbDifferences']()).toEqual('5');
    });

    it('should emit LeaveGame when the player quit the page', () => {
        const spyEmit = spyOn(socketHelper, 'emit');
        component.ngOnDestroy();
        expect(spyEmit).toHaveBeenCalled();
    });

    it('should open snackbar', () => {
        const spySnackBar = spyOn(component['snackBar'], 'openFromComponent').and.resolveTo();

        component.openSnackBar();
        expect(spySnackBar).toHaveBeenCalled();
    });
});
