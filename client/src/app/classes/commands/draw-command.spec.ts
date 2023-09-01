import { CanvasType } from '@app/enums/canvas-type';
import { Command } from '@app/interfaces/command';
import { StrokeStyle } from '@app/interfaces/stroke-style';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { DrawCommand } from './draw-command';

describe('clearForegroundCommand', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawService', ['redraw']);
    });

    it('redraw should be called', () => {
        const commandArgs: Command = {
            canvasType: CanvasType.Right,
            name: 'draw',
            strokes: [],
            style: {} as StrokeStyle,
        };
        const command = new DrawCommand(commandArgs, drawServiceSpy);
        command.execute();
        expect(drawServiceSpy.redraw).toHaveBeenCalledWith(commandArgs);
    });
});
