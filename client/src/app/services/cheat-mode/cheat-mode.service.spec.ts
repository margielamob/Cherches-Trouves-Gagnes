import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';

import { Socket } from 'socket.io-client';
import { CheatModeService } from './cheat-mode.service';
/* eslint-disable @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)*/
class SocketClientServiceMock extends CommunicationSocketService {
    override connect() {}
}

describe('CheatModeService', () => {
    let service: CheatModeService;
    let differenceDetectionHandlerSpyObj: jasmine.SpyObj<DifferencesDetectionHandlerService>;
    let socketHelper: SocketTestHelper;
    let socketServiceMock: SocketClientServiceMock;

    beforeEach(() => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        differenceDetectionHandlerSpyObj = jasmine.createSpyObj('DifferenceDetectionHandler', ['displayDifferenceTemp']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule, RouterTestingModule],
            providers: [
                { provide: DifferencesDetectionHandlerService, useValue: differenceDetectionHandlerSpyObj },
                { provide: CommunicationSocketService, useValue: socketServiceMock },
            ],
        });
        service = TestBed.inject(CheatModeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should manage cheat mode', async () => {
        const stopSpy = spyOn(Object.getPrototypeOf(service), 'stopCheatMode').and.callFake(() => false);
        const startSpy = spyOn(Object.getPrototypeOf(service), 'startCheatMode')
            .and.callFake(async () => new Promise(() => true))
            .and.resolveTo();

        service.isCheatModeActivated = true;
        await service.manageCheatMode({} as CanvasRenderingContext2D, {} as CanvasRenderingContext2D);
        expect(stopSpy).toHaveBeenCalled();
        service.isCheatModeActivated = false;
        await service.manageCheatMode({} as CanvasRenderingContext2D, {} as CanvasRenderingContext2D);
        expect(startSpy).toHaveBeenCalled();
    });

    it('should stop all clock for cheat mode', () => {
        service['intervals'] = [{ difference: [], clocks: [1] }];
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const stopCheatModeDifference = spyOn(service, 'stopCheatModeDifference').and.callFake(() => {});
        expect(service['stopCheatMode']({} as CanvasRenderingContext2D, {} as CanvasRenderingContext2D)).toEqual(false);
        expect(stopCheatModeDifference).toHaveBeenCalled();
        expect(service['intervals']).toEqual([]);
    });

    it('should start cheat mode difference', () => {
        differenceDetectionHandlerSpyObj.displayDifferenceTemp.and.callFake(() => 1);
        expect(service['startCheatModeDifference']({} as CanvasRenderingContext2D, {} as CanvasRenderingContext2D, [])).toEqual([1, 1]);
    });

    it('should start cheat mode', async () => {
        const fetchAllDifferenceNotFound = spyOn(Object.getPrototypeOf(service), 'fetchAllDifferenceNotFound').and.callFake(
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            async () => new Promise(() => {}),
        );
        fetchAllDifferenceNotFound.and.resolveTo();
        const spyStartCheatModeDifference = spyOn(Object.getPrototypeOf(service), 'startCheatModeDifference').and.callFake(() => [1]);
        service['coords'] = [[{ x: 0, y: 0 }]];
        expect(await service['startCheatMode']({} as CanvasRenderingContext2D, {} as CanvasRenderingContext2D)).toEqual(true);
        expect(fetchAllDifferenceNotFound).toHaveBeenCalled();
        expect(spyStartCheatModeDifference).toHaveBeenCalled();
        expect(
            service['intervals'].find(
                (interval: { difference: Coordinate[]; clocks: number[] }) =>
                    interval.difference[0].x === 0 && interval.difference[0].y === 0 && interval.clocks[0] === 1,
            ),
        ).not.toEqual(undefined);
    });

    it('should fetch all difference not found', async () => {
        const expectedCoords = [[{ x: 0, y: 0 }]];
        const fetch = service['fetchAllDifferenceNotFound']();
        socketHelper.peerSideEmit(SocketEvent.FetchDifferences, expectedCoords);
        await fetch;
        expect(service['coords']).toEqual(expectedCoords);
    });

    it('should find clocks of a specific difference', () => {
        const expectedDifference = [{ x: 0, y: 0 }];
        const expectedInterval = { difference: expectedDifference, clocks: [1] };
        service['intervals'] = [expectedInterval];
        expect(service.findClocksDifference(expectedDifference)).toEqual(expectedInterval);
    });

    it('should stop cheat mode difference', () => {
        const expectedDifference = [{ x: 0, y: 0 }];
        spyOn(Object.getPrototypeOf(service), 'findClocksDifference').and.callFake(() => {
            return { difference: expectedDifference, clocks: [1] };
        });
        const spyClearInterval = spyOn(window, 'clearInterval').and.callFake(() => {});
        const ctx = { clearRect: () => {} } as unknown as CanvasRenderingContext2D;
        service.stopCheatModeDifference(ctx, ctx, expectedDifference);
        expect(spyClearInterval).toHaveBeenCalled();
    });

    it('should stop cheat mode difference', () => {
        const expectedDifference = [{ x: 0, y: 0 }];
        spyOn(Object.getPrototypeOf(service), 'findClocksDifference').and.callFake(() => {
            return;
        });
        const spyClearInterval = spyOn(window, 'clearInterval').and.callFake(() => {});
        const ctx = { clearRect: () => {} } as unknown as CanvasRenderingContext2D;
        service.stopCheatModeDifference(ctx, ctx, expectedDifference);
        expect(spyClearInterval).not.toHaveBeenCalled();
    });

    it('should handle socket for reset cheat mode when a new board is load', async () => {
        const stopCheatModeStub = spyOn(Object.getPrototypeOf(service), 'stopCheatMode').and.callFake(() => {});
        const startCheatModeStub = spyOn(Object.getPrototypeOf(service), 'startCheatMode').and.callFake(() => {});
        const fetchAllGamesStub = spyOn(Object.getPrototypeOf(service), 'fetchAllDifferenceNotFound')
            .and.callFake(async () => new Promise(() => true))
            .and.resolveTo();
        service.isCheatModeActivated = true;
        service.handleSocketEvent({} as CanvasRenderingContext2D, {} as CanvasRenderingContext2D);
        await socketHelper.peerSideEmit(SocketEvent.NewGameBoard);
        expect(stopCheatModeStub).toHaveBeenCalled();
        expect(startCheatModeStub).toHaveBeenCalled();
        expect(fetchAllGamesStub).toHaveBeenCalled();
    });

    it('should remove the handle SocketEvent', () => {
        const offStub = spyOn(socketServiceMock, 'off').and.callFake(() => {});
        service.removeHandleSocketEvent();
        expect(offStub).toHaveBeenCalled();
    });
});
