import { Injectable } from '@angular/core';
import { DrawService } from '@app/services/draw-service/draw-service.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasEventHandlerService {
    constructor(private drawService: DrawService) {}

    handleCtrlShiftZ() {
        this.drawService.redo();
    }

    handleCtrlZ() {
        this.drawService.undo();
    }
}
