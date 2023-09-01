import { ElementRef } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';

export interface DrawingBoardState {
    canvasType: CanvasType;
    foreground: ElementRef<HTMLCanvasElement>;
    background: ElementRef<HTMLCanvasElement>;
    temporary: ElementRef<HTMLCanvasElement>;
}
