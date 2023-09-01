import { ElementRef } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { SwitchForegroundCommand } from './switch-foreground-command';

describe('switchForegroundCommand', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawService', ['switchForegroundImageData']);
    });

    it('execute should be call switchForegroundImageData', () => {
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
        const command = new SwitchForegroundCommand(firstCanvasState, secondCanvasState, drawServiceSpy);
        command.execute();
        expect(drawServiceSpy.switchForegroundImageData).toHaveBeenCalledWith(firstCanvasState, secondCanvasState);
    });
});
