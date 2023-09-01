import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class SwitchForegroundCommand implements DrawingCommand {
    private leftCanvas: DrawingBoardState;
    private rightCanvas: DrawingBoardState;

    constructor(leftCanvas: DrawingBoardState, rightCanvas: DrawingBoardState, private readonly drawService: DrawService) {
        this.leftCanvas = leftCanvas;
        this.rightCanvas = rightCanvas;
    }

    execute(): void {
        this.drawService.switchForegroundImageData(this.leftCanvas, this.rightCanvas);
    }
}
