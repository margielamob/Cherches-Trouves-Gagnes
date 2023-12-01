import { ElementRef } from '@angular/core';
import { Command } from '@app/interfaces/command';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class ChangeBackgroundCommand implements DrawingCommand {
    private command: Command;
    constructor(command: Command, private canvas: ElementRef<HTMLCanvasElement>, private readonly drawService: DrawService) {
        this.command = command;
    }
    execute(): void {
        this.drawService.redoBackgroundChange(this.command, this.canvas);
    }
}
