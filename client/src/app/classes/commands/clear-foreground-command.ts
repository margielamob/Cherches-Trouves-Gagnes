import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class ClearForegroundCommand implements DrawingCommand {
    private foreground: CanvasRenderingContext2D;

    constructor(foreground: CanvasRenderingContext2D, private readonly drawService: DrawService) {
        this.foreground = foreground;
    }

    execute() {
        this.drawService.clearForeground(this.foreground);
    }
}
