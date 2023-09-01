import { Injectable } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';

@Injectable({
    providedIn: 'root',
})
export class CanvasStateService {
    states: DrawingBoardState[] = [];
    private focusedCanvas: CanvasType = CanvasType.None;

    getCanvasState(canvasType: CanvasType): DrawingBoardState | undefined {
        return this.states.find((state) => state.canvasType === canvasType);
    }

    getFocusedCanvas(): DrawingBoardState | undefined {
        return this.getCanvasState(this.focusedCanvas);
    }

    setFocusedCanvas(canvasState: CanvasType): void {
        this.focusedCanvas = canvasState;
    }
}
