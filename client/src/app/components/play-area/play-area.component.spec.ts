/* eslint-disable max-lines */
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SIZE } from '@app/constants/canvas';
import { CheatModeService } from '@app/services/cheat-mode/cheat-mode.service';
import { ClueHandlerService } from '@app/services/clue-handler-service/clue-handler.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { RouterService } from '@app/services/router-service/router.service';
import { Coordinate } from '@common/coordinate';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';

import { of, Subject } from 'rxjs';
import { Socket } from 'socket.io-client';

class SocketClientServiceMock extends CommunicationSocketService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)
    override connect() {}
}
describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gameInformationHandlerServiceSpy: jasmine.SpyObj<GameInformationHandlerService>;
    let spyMouseHandlerService: jasmine.SpyObj<MouseHandlerService>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    let differenceService: jasmine.SpyObj<DifferencesDetectionHandlerService>;
    let routerSpyObj: jasmine.SpyObj<RouterService>;
    let cheatModeService: jasmine.SpyObj<CheatModeService>;
    let spyClueHandlerService: jasmine.SpyObj<ClueHandlerService>;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getImgData']);
        spyMouseHandlerService = jasmine.createSpyObj('MouseHandlerService', ['mouseHitDetect']);
        differenceService = jasmine.createSpyObj('DifferencesDetectionHandlerService', [
            'setContextImgModified',
            'setNumberDifferencesFound',
            'differenceDetected',
            'playCorrectSound',
            'showClue',
        ]);
        routerSpyObj = jasmine.createSpyObj('RouterService', ['navigateTo']);
        cheatModeService = jasmine.createSpyObj(
            'CheatModeService',
            ['manageCheatMode', 'stopCheatModeDifference', 'handleSocketEvent', 'removeHandleSocketEvent'],
            { isCheatModeActivated: true },
        );
        gameInformationHandlerServiceSpy = jasmine.createSpyObj(
            'GameInformationHandlerService',
            [
                'getGameMode',
                'getGameName',
                'getPlayerName',
                'getOriginalBmp',
                'getOriginalBmpId',
                'getModifiedBmpId',
                'getGameInformation',
                'setGameInformation',
                'getNbTotalDifferences',
                'isLimitedTime',
                'isClassic',
            ],
            { $newGame: new Subject<void>() },
        );
        spyClueHandlerService = jasmine.createSpyObj('ClueHandlerService', ['getClue', 'showClue']);

        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [RouterTestingModule, HttpClientModule, MatDialogModule],

            providers: [
                {
                    provide: GameInformationHandlerService,
                    useValue: gameInformationHandlerServiceSpy,
                },
                {
                    provide: CheatModeService,
                    useValue: cheatModeService,
                },
                {
                    provide: MouseHandlerService,
                    useValue: spyMouseHandlerService,
                },
                {
                    provide: CommunicationService,
                    useValue: communicationServiceSpy,
                },
                {
                    provide: DifferencesDetectionHandlerService,
                    useValue: differenceService,
                },
                {
                    provide: ClueHandlerService,
                    useValue: spyClueHandlerService,
                },
                { provide: RouterService, useValue: routerSpyObj },
                { provide: CommunicationSocketService, useValue: socketServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        gameInformationHandlerServiceSpy.gameInformation = {
            id: '1',
            name: 'test',
            idOriginalBmp: 'original',
            thumbnail: 'string',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 1,
            isMulti: false,
        };
        gameInformationHandlerServiceSpy.gameMode = GameMode.Classic;
        gameInformationHandlerServiceSpy.players = [{ name: 'test', nbDifferences: 0 }];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should handle clue on ngOnInit', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component, 'getContextModified').and.callFake(() => {
            return ctx;
        });
        spyOn(component, 'getContextOriginal').and.callFake(() => {
            return ctx;
        });

        component.ngOnInit();
        socketHelper.peerSideEmit(SocketEvent.Clue, { clue: [{ x: 1, y: 3 }] as Coordinate[], nbClues: 2 });

        expect(spyClueHandlerService.showClue).toHaveBeenCalled();
    });

    /* eslint-disable @typescript-eslint/no-magic-numbers -- 1500 -> 1.5 seconds and 5000 -> 5 seconds */
    it('should handle clue when player is on third clue askes on ngOnInit', fakeAsync(() => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component, 'getContextModified').and.callFake(() => {
            return ctx;
        });
        spyOn(component, 'getContextOriginal').and.callFake(() => {
            return ctx;
        });

        component.ngOnInit();
        socketHelper.peerSideEmit(SocketEvent.Clue, { clue: [{ x: 1, y: 3 }] as Coordinate[], nbClues: 3 });

        tick(1500);
        expect(component.isThirdClue).toEqual(true);
        tick(5000);
        expect(component.isThirdClue).toEqual(false);
        expect(spyClueHandlerService.showClue).not.toHaveBeenCalled();
        discardPeriodicTasks();
    }));

    it('should display image afterViewInit', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyDisplayImage = spyOn(component, 'displayImage').and.callFake(() => {});
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component, 'getContextImgModified').and.callFake(() => ctx);
        spyOn(component, 'getContextImgOriginal').and.callFake(() => ctx);
        spyOn(component, 'getContextDifferences').and.callFake(() => ctx);
        spyOn(component, 'getContextOriginal').and.callFake(() => ctx);
        spyOn(component, 'getContextModified').and.callFake(() => ctx);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        component.ngAfterViewInit();

        expect(spyDisplayImage).toHaveBeenCalledTimes(3);
    });

    it('should return width', () => {
        expect(component.width).toEqual(SIZE.x);
    });

    it('should return height', () => {
        expect(component.height).toEqual(SIZE.y);
    });

    it('buttonDetect should modify the buttonPressed variable', () => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(component.buttonPressed).toEqual(expectedKey);
    });

    it('on click should call mouseHandlerService', () => {
        differenceService.mouseIsDisabled = false;
        const mouseEvent = {
            offsetX: 10,
            offsetY: 10,
            button: 0,
        } as MouseEvent;

        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const spyGetCtxOriginal = spyOn(component, 'getContextOriginal').and.callFake(() => ctx);
        component.onClick(mouseEvent, 'original');
        expect(spyGetCtxOriginal).toHaveBeenCalled();
        expect(spyMouseHandlerService.mouseHitDetect).toHaveBeenCalled();

        const spyGetCtxModified = spyOn(component, 'getContextModified').and.callFake(() => ctx);
        component.onClick(mouseEvent, 'modified');
        expect(spyGetCtxModified).toHaveBeenCalled();
    });

    it('should get image form server', () => {
        communicationServiceSpy.getImgData.and.callFake(() => {
            return of({ body: { image: '' } } as HttpResponse<{ image: string }>);
        });
        component.getImageData('');
        expect(communicationServiceSpy.getImgData).toHaveBeenCalled();
    });

    it('should not display image and go to the main page', () => {
        // can display example image to draw Image
        const srcImage =
            // eslint-disable-next-line max-len
            'Qk1SAgAAAAAAADYAAAAoAAAADAAAAPH///8BABgAAAAAABwCAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////';
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component, 'getContextOriginal').and.callFake(() => ctx);
        spyOn(component, 'getContextModified').and.callFake(() => ctx);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(ctx, 'drawImage').and.callFake(() => {});
        const spyGetImage = spyOn(component, 'getImageData').and.callFake(() => {
            return of({ body: { image: srcImage } } as HttpResponse<{ image: string }>);
        });

        component.displayImage(true, ctx);
        expect(spyGetImage).toHaveBeenCalledWith(gameInformationHandlerServiceSpy.getOriginalBmpId());
        expect(gameInformationHandlerServiceSpy.getOriginalBmpId).toHaveBeenCalled();
    });

    it('should display image', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component, 'getContextOriginal').and.callFake(() => ctx);
        spyOn(component, 'getContextModified').and.callFake(() => ctx);

        const spyGetImage = spyOn(component, 'getImageData').and.callFake(() => {
            return of({ body: { image: '' } } as HttpResponse<{ image: string }>);
        });

        component.displayImage(true, ctx);
        expect(spyGetImage).toHaveBeenCalledWith(gameInformationHandlerServiceSpy.getOriginalBmpId());
        expect(gameInformationHandlerServiceSpy.getOriginalBmpId).toHaveBeenCalled();

        component.displayImage(false, ctx);
        expect(spyGetImage).toHaveBeenCalledWith(gameInformationHandlerServiceSpy.getModifiedBmpId());
        expect(gameInformationHandlerServiceSpy.getModifiedBmpId).toHaveBeenCalled();
    });
    it('should not display image if response is empty', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component, 'getContextOriginal').and.callFake(() => ctx);
        spyOn(component, 'getContextModified').and.callFake(() => ctx);

        const spyGetImage = spyOn(component, 'getImageData').and.callFake(() => {
            return of({} as HttpResponse<{ image: string }>);
        });

        component.displayImage(true, ctx);
        expect(spyGetImage).toHaveBeenCalledWith(gameInformationHandlerServiceSpy.getOriginalBmpId());
        expect(gameInformationHandlerServiceSpy.getOriginalBmpId).toHaveBeenCalled();

        component.displayImage(false, ctx);
        expect(spyGetImage).toHaveBeenCalledWith(gameInformationHandlerServiceSpy.getModifiedBmpId());
        expect(gameInformationHandlerServiceSpy.getModifiedBmpId).toHaveBeenCalled();
    });

    it('should return context', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        spyOn(component, 'displayImage').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
        fixture.detectChanges();

        const expected = component['canvasImgDifference'].nativeElement.getContext('2d') as CanvasRenderingContext2D;
        expect(component.getContextDifferences()).toEqual(expected);
    });

    it('should return context', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        spyOn(component, 'displayImage').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
        fixture.detectChanges();

        const expected = component['canvasImgOriginal'].nativeElement.getContext('2d') as CanvasRenderingContext2D;
        expect(component.getContextImgOriginal()).toEqual(expected);
    });

    it('should return context', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        spyOn(component, 'displayImage').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
        fixture.detectChanges();

        const expected = component['canvasImgModified'].nativeElement.getContext('2d') as CanvasRenderingContext2D;
        expect(component.getContextImgModified()).toEqual(expected);
    });

    it('should return context', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        spyOn(component, 'displayImage').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
        fixture.detectChanges();

        const expected = component['canvasOriginal'].nativeElement.getContext('2d') as CanvasRenderingContext2D;
        expect(component.getContextOriginal()).toEqual(expected);
    });

    it('should return context', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        spyOn(component, 'displayImage').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        spyOn(component, 'ngAfterViewInit').and.callFake(() => {});
        fixture.detectChanges();

        const expected = component['canvasModified'].nativeElement.getContext('2d') as CanvasRenderingContext2D;
        expect(component.getContextModified()).toEqual(expected);
    });

    it('should detect keyboard event and not pass if the target is an input', async () => {
        await component.keyBoardDetected({ target: { tagName: 'INPUT' } as unknown as HTMLElement } as unknown as KeyboardEvent);
        expect(cheatModeService.manageCheatMode).not.toHaveBeenCalled();
    });

    it('should detect keyboard event and not pass if the the key is not t', async () => {
        await component.keyBoardDetected({ target: { tagName: 'TEST' } as unknown as HTMLElement, key: 'a' } as unknown as KeyboardEvent);
        expect(cheatModeService.manageCheatMode).not.toHaveBeenCalled();
    });

    it('should manage the cheat mode if the t is press', async () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        cheatModeService.manageCheatMode.and
            .callFake(async () => {
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
                return new Promise(() => {});
            })
            .and.resolveTo();
        spyOn(component, 'getContextOriginal').and.callFake(() => {
            return ctx;
        });
        spyOn(component, 'getContextModified').and.callFake(() => {
            return ctx;
        });
        await component.keyBoardDetected({ target: { tagName: 'TEST' } as unknown as HTMLElement, key: 't' } as unknown as KeyboardEvent);
        expect(cheatModeService.manageCheatMode).toHaveBeenCalled();
    });

    it('should manage the clue service if the i is press', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- test
        spyClueHandlerService.getClue.and.callFake(() => {});
        await component.keyBoardDetected({ target: { tagName: 'TEST' } as unknown as HTMLElement, key: 'i' } as unknown as KeyboardEvent);
        expect(spyClueHandlerService.getClue).toHaveBeenCalled();
    });

    it('should display new image on socket event', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(component, 'getContextImgModified').and.callFake(() => {
            return ctx;
        });
        spyOn(component, 'getContextDifferences').and.callFake(() => {
            return ctx;
        });
        spyOn(component, 'getContextImgOriginal').and.callFake(() => {
            return ctx;
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyDisplayImage = spyOn(component, 'displayImage').and.callFake(() => {});
        component.handleSocketDifferenceFound();
        socketHelper.peerSideEmit(SocketEvent.NewGameBoard, {} as PublicGameInformation);
        expect(spyDisplayImage).toHaveBeenCalled();
    });
});
