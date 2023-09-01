import { Injectable } from '@angular/core';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';

@Injectable({
    providedIn: 'root',
})
export class MouseHandlerService {
    constructor(private readonly differencesDetectionHandlerService: DifferencesDetectionHandlerService) {}

    mouseHitDetect($event: MouseEvent, ctx: CanvasRenderingContext2D, gameId: string) {
        this.differencesDetectionHandlerService.getDifferenceValidation(gameId, { x: $event.offsetX, y: $event.offsetY }, ctx);
    }
}
