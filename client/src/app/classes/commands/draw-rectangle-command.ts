import { ElementRef } from '@angular/core';
import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class DrawRectangleCommand implements DrawingCommand {
    private command: Command;
    // eslint-disable-next-line max-params
    constructor(
        baseCommand: Command,
        private focusedCanvas: ElementRef<HTMLCanvasElement>,
        private fillColor: string,
        private readonly drawService: DrawService,
    ) {
        this.command = baseCommand;
    }

    execute(): void {
        this.drawService.redrawRectangle(this.command, this.focusedCanvas, this.fillColor);
    }
}
