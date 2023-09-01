import { HttpClientModule } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SIZE } from '@app/constants/canvas';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
import { Subject } from 'rxjs';
import { Socket } from 'socket.io-client';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { ClueHandlerService } from './clue-handler.service';

/* eslint-disable @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)*/
class SocketClientServiceMock extends CommunicationSocketService {
    override connect() {}
}

describe('ClueHandlerService', () => {
    let service: ClueHandlerService;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let gameInformationHandlerServiceSpy: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(() => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        gameInformationHandlerServiceSpy = jasmine.createSpyObj(
            'GameInformationHandlerService',
            ['getNbTotalDifferences', 'getNbDifferences', 'getPlayer'],
            { $newGame: new Subject<string>() },
        );
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule, RouterTestingModule],
            providers: [
                { provide: CommunicationSocketService, useValue: socketServiceMock },
                {
                    provide: GameInformationHandlerService,
                    useValue: gameInformationHandlerServiceSpy,
                },
            ],
        });
        gameInformationHandlerServiceSpy.getPlayer.and.callFake(() => {
            return { name: '', nbDifferences: 1 };
        });
        service = TestBed.inject(ClueHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should increment clue counter when clue is asked', () => {
        const expectedCount = 1;
        service['clueAskedCounter'] = 0;
        spyOn(service, 'isGameOver').and.callFake(() => false);
        const spySend = spyOn(service.communicationSocket, 'send');
        service.getClue();
        socketHelper.peerSideEmit(SocketEvent.Clue, 'clue');
        socketHelper.peerSideEmit(SocketEvent.EventMessage, 'event');
        expect(spySend).toHaveBeenCalled();
        expect(service['clueAskedCounter']).toEqual(expectedCount);
    });

    it('should say if game is over', () => {
        gameInformationHandlerServiceSpy.getNbDifferences.and.callFake(() => 0);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- test
        gameInformationHandlerServiceSpy.getNbTotalDifferences.and.callFake(() => 4);
        expect(service.isGameOver()).toBe(false);
    });

    it('should return the number of clue asked', () => {
        service['clueAskedCounter'] = 3;
        const result = service.getNbCluesAsked();
        expect(result).toEqual(3);
    });
    it('should show a clue', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const coord: Coordinate[] = [{ x: 0, y: 0 }];
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyDrawRect = spyOn(Object.getPrototypeOf(service), 'drawRect').and.callFake(() => {});
        service.showClue(ctx, coord);
        expect(spyDrawRect).toHaveBeenCalled();
    });

    it('should drawRect on canvas and erase it ', fakeAsync(() => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const saveSpy = spyOn(ctx, 'save');
        const clearRectSpy = spyOn(ctx, 'clearRect');
        const strokeRectSpy = spyOn(ctx, 'strokeRect');
        const restoreSpy = spyOn(ctx, 'restore');

        service['drawRect'](ctx, [
            { x: 1, y: 3 },
            { x: 3, y: 6 },
        ]);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- test
        tick(1500);
        expect(strokeRectSpy).toHaveBeenCalled();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- test
        tick(1500);
        expect(clearRectSpy).toHaveBeenCalled();
        expect(saveSpy).toHaveBeenCalled();
        expect(restoreSpy).toHaveBeenCalled();
    }));
});
