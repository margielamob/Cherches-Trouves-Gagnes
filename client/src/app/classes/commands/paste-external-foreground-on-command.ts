import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class PasteExternalForegroundOnCommand implements DrawingCommand {
    private firstCanvas: DrawingBoardState;
    private secondCanvas: DrawingBoardState;

    constructor(firstCanvas: DrawingBoardState, secondCanvas: DrawingBoardState, private readonly drawService: DrawService) {
        this.firstCanvas = firstCanvas;
        this.secondCanvas = secondCanvas;
    }
    execute(): void {
        this.drawService.pasteImageDataOn(this.firstCanvas, this.secondCanvas);
    }
}
