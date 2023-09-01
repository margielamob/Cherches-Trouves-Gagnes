import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanvasType } from '@app/enums/canvas-type';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';

import { CanvasStateService } from './canvas-state.service';

describe('CanvasStateService', () => {
    let service: CanvasStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CanvasStateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should not find the canvas state if it does not exist', () => {
        service.states = [];
        expect(service.getCanvasState(CanvasType.Left)).toEqual(undefined);
    });

    it('should return the matching canvas state', () => {
        service.states = [
            {
                canvasType: CanvasType.Left,
            } as DrawingBoardState,
        ];
        expect(service.getCanvasState(CanvasType.Left)).toEqual(service.states[0]);
    });

    it('should set focus canvas', () => {
        const expectedCanvasType = CanvasType.Left;
        service.setFocusedCanvas(expectedCanvasType);
        expect(service['focusedCanvas']).toEqual(expectedCanvasType);
    });

    it('should get the focus canvas', () => {
        service['focusedCanvas'] = CanvasType.Left;
        expect(service.getFocusedCanvas()).toEqual(undefined);
        service.states = [
            {
                canvasType: CanvasType.Left,
                foreground: {} as ElementRef<HTMLCanvasElement>,
                background: {} as ElementRef<HTMLCanvasElement>,
                temporary: {} as ElementRef<HTMLCanvasElement>,
            },
        ];
    });
});
