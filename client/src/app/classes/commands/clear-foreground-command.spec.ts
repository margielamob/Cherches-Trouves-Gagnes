import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SIZE } from '@app/constants/canvas';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ClearForegroundCommand } from './clear-foreground-command';

describe('clearForegroundCommand', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawService', ['clearForeground']);
    });

    it('clearForeground should be called', () => {
        const canvas = CanvasTestHelper.createCanvas(SIZE.x, SIZE.y);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const command = new ClearForegroundCommand(ctx, drawServiceSpy);
        command.execute();
        expect(drawServiceSpy.clearForeground).toHaveBeenCalledWith(ctx);
    });
});
