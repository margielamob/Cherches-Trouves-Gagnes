import { TestBed } from '@angular/core/testing';
import { DrawService } from '@app/services/draw-service/draw-service.service';

import { CanvasEventHandlerService } from './canvas-event-handler.service';

describe('CanvasEventHandlerService', () => {
    let service: CanvasEventHandlerService;
    let drawServiceSpyObj: jasmine.SpyObj<DrawService>;
    beforeEach(() => {
        drawServiceSpyObj = jasmine.createSpyObj('DrawService', ['redo', 'undo']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawService, useValue: drawServiceSpyObj }],
        });
        service = TestBed.inject(CanvasEventHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should handle ctrl shift z', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        drawServiceSpyObj.redo.and.callFake(() => {});
        service.handleCtrlShiftZ();
        expect(drawServiceSpyObj.redo).toHaveBeenCalled();
    });

    it('should handle ctrl shift z', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        drawServiceSpyObj.undo.and.callFake(() => {});
        service.handleCtrlZ();
        expect(drawServiceSpyObj.undo).toHaveBeenCalled();
    });
});
