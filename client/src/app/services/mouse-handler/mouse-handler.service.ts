import { Injectable } from '@angular/core';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';

@Injectable({
    providedIn: 'root',
})
export class MouseHandlerService {
    constructor(private readonly differencesDetectionHandlerService: DifferencesDetectionHandlerService) {}

    // eslint-disable-next-line max-params
    mouseHitDetect($event: MouseEvent, ctx: CanvasRenderingContext2D, gameId: string, isOriginal: boolean) {
        if (!this.differencesDetectionHandlerService.mouseIsDisabled) {
            this.differencesDetectionHandlerService.getDifferenceValidation(gameId, { x: $event.offsetX, y: $event.offsetY }, ctx, isOriginal);
        }
    }
}
