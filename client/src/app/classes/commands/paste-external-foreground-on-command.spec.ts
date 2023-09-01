import { ElementRef } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { PasteExternalForegroundOnCommand } from './paste-external-foreground-on-command';

describe('clearForegroundCommand', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawService', ['pasteImageDataOn']);
    });

    it('pasteForeground should be called', () => {
        const firstCanvasState: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: {} as ElementRef<HTMLCanvasElement>,
            background: {} as ElementRef<HTMLCanvasElement>,
            temporary: {} as ElementRef<HTMLCanvasElement>,
        };

        const secondCanvasState: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: {} as ElementRef<HTMLCanvasElement>,
            background: {} as ElementRef<HTMLCanvasElement>,
            temporary: {} as ElementRef<HTMLCanvasElement>,
        };
        const command = new PasteExternalForegroundOnCommand(firstCanvasState, secondCanvasState, drawServiceSpy);
        command.execute();
        expect(drawServiceSpy.pasteImageDataOn).toHaveBeenCalledWith(firstCanvasState, secondCanvasState);
    });
});
