import { Command } from '@app/interfaces/command';
import { DrawService } from '@app/services/draw-service/draw-service.service';

export class DrawCommand implements DrawCommand {
    private command: Command;

    constructor(command: Command, private readonly drawService: DrawService) {
        this.command = command;
    }
    execute(): void {
        this.drawService.redraw(this.command);
    }
}
