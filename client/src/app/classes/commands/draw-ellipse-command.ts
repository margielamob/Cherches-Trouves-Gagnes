import { ElementRef } from '@angular/core';
import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class DrawEllipseCommand implements DrawingCommand {
    private baseCommand: Command;

    constructor(baseCommand: Command, private canvas: ElementRef<HTMLCanvasElement>, private drawService: DrawService) {
        this.baseCommand = baseCommand;
    }

    execute(): void {
        this.drawService.redrawEllipse(this.baseCommand, this.canvas);
    }
}
