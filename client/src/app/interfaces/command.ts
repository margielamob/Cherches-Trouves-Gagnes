import { CanvasType } from '@app/enums/canvas-type';
import { Rectangle } from './rectangle';
import { Stroke } from './stroke';
import { StrokeStyle } from './stroke-style';

export interface Command {
    canvasType: CanvasType;
    name: string;
    strokes: Stroke[];
    rectangle?: Rectangle;
    style: StrokeStyle;
}
