import { HttpClientModule } from '@angular/common/http';
import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SIZE } from '@app/constants/canvas';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';
import { Subject } from 'rxjs';
import { Socket } from 'socket.io-client';
import { DifferencesDetectionHandlerService } from './differences-detection-handler.service';

class SocketClientServiceMock extends CommunicationSocketService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)
    override connect() {}
}

describe('DifferencesDetectionHandlerService', () => {
    let service: DifferencesDetectionHandlerService;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;
    let spyGameInfoHandlerService: jasmine.SpyObj<GameInformationHandlerService>;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;
    beforeEach(() => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        spyMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
        spyGameInfoHandlerService = jasmine.createSpyObj('GameInformationHandlerService', ['getNbDifferences', 'getNbTotalDifferences'], {
            players: [
                { name: 'test', nbDifferences: 0 },
                { name: 'test2', nbDifferences: 0 },
            ],
            $differenceFound: new Subject<string>(),
        });
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['validateCoordinates']);

        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule, RouterTestingModule],
            providers: [
                { provide: MatDialog, useValue: spyMatDialog },
                { provide: GameInformationHandlerService, useValue: spyGameInfoHandlerService },
                { provide: CommunicationService, useValue: spyCommunicationService },
                { provide: CommunicationSocketService, useValue: socketServiceMock },
            ],
        });
        service = TestBed.inject(DifferencesDetectionHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should set the difference found for each player', () => {
        const expectedBeforeMainPlayerScore = 0;
        service.setNumberDifferencesFound(true);
        expect(spyGameInfoHandlerService.players[0].nbDifferences).toEqual(expectedBeforeMainPlayerScore + 1);
        service.setNumberDifferencesFound(false);
        expect(spyGameInfoHandlerService.players[1].nbDifferences).toEqual(expectedBeforeMainPlayerScore + 1);
    });

    it('should play sound', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- play mocked and return {}
        const expectedAudio = { play: () => {} } as HTMLAudioElement;
        const spy = spyOn(expectedAudio, 'play');

        service.playSound(expectedAudio);
        expect(spy).toHaveBeenCalled();
    });

    it('should play wrong sound', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyPlaySound = spyOn(service, 'playSound').and.callFake(() => {});
        service.playWrongSound();
        expect(spyPlaySound).toHaveBeenCalled();
    });

    it('should play correct sound', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyPlaySound = spyOn(service, 'playSound').and.callFake(() => {});
        service.playCorrectSound();
        expect(spyPlaySound).toHaveBeenCalled();
    });

    it('should play wrong sound when difference not detected', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spy = spyOn(service, 'playWrongSound').and.callFake(() => {});
        service.differenceNotDetected({ x: 0, y: 0 }, ctx);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    /* eslint-disable @typescript-eslint/no-magic-numbers -- 1000 -> 1 second  */
    it('should disabled mouse for one second when difference not detected', fakeAsync(() => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const mousePosition = { x: 0, y: 0 };
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyWrongPlaySound = spyOn(service, 'playWrongSound').and.callFake(() => {});
        const spyFillText = spyOn(ctx, 'fillText');
        expect(service.mouseIsDisabled).toBeFalsy();
        service.differenceNotDetected(mousePosition, ctx);
        expect(spyWrongPlaySound).toHaveBeenCalled();
        expect(spyFillText).toHaveBeenCalled();
        expect(service.mouseIsDisabled).toBeTruthy();
        tick(1000);
        expect(service.mouseIsDisabled).toBeFalsy();
    }));

    it('should play correct sound when difference not detected', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spy = spyOn(service, 'playCorrectSound').and.callFake(() => {});
        service.differenceDetected(ctx, ctx, []);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call display and clear ctx', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const spyDisplay = spyOn(Object.getPrototypeOf(service), 'displayDifferenceTemp');
        const spyClear = spyOn(Object.getPrototypeOf(service), 'clearDifference');
        const spyPlayCorrectSound = spyOn(service, 'playCorrectSound');
        service.differenceDetected(ctx, ctx, []);

        expect(spyPlayCorrectSound).toHaveBeenCalled();
        expect(spyDisplay).toHaveBeenCalled();
        expect(spyClear).toHaveBeenCalled();

        service.differenceDetected(ctx, ctx, []);
        expect(spyDisplay).toHaveBeenCalled();
        expect(spyClear).toHaveBeenCalled();
    });

    /* eslint-disable @typescript-eslint/no-magic-numbers -- 1500 -> 1.5 seconds */
    it('should draw on canvas and not cheat mode', fakeAsync(() => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const clearRectSpy = spyOn(ctx, 'clearRect');
        const fillRectSpy = spyOn(ctx, 'fillRect');

        const timerId = service['displayDifferenceTemp'](ctx, [{ x: 1, y: 3 }], false);
        tick(1500);
        expect(fillRectSpy).toHaveBeenCalled();
        tick(1500);
        expect(clearRectSpy).toHaveBeenCalled();
        clearInterval(timerId);
    }));

    /* eslint-disable @typescript-eslint/no-magic-numbers -- 1500 -> 1.5 seconds */
    it('should draw on canvas and cheat mode', fakeAsync(() => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const clearRectSpy = spyOn(ctx, 'clearRect');
        const fillRectSpy = spyOn(ctx, 'fillRect');

        service['displayDifferenceTemp'](ctx, [{ x: 1, y: 3 }], true);
        tick(1500);
        expect(fillRectSpy).toHaveBeenCalled();
        tick(5000);
        expect(clearRectSpy).toHaveBeenCalled();
        discardPeriodicTasks();
    }));

    it('should clear on canvas', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const clearRectSpy = spyOn(ctx, 'clearRect');
        service['clearDifference'](ctx, [{ x: 1, y: 3 }]);
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('should verify with server if coord is not valid', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyDifferenceNotDetected = spyOn(service, 'differenceNotDetected').and.callFake(() => {});
        service.getDifferenceValidation('1', { x: 0, y: 0 }, ctx);
        socketHelper.peerSideEmit(SocketEvent.DifferenceNotFound);
        expect(spyDifferenceNotDetected).toHaveBeenCalled();
    });
});
