import { CanvasType } from '@app/enums/canvas-type';
import { Stroke } from './stroke';
import { StrokeStyle } from './stroke-style';

export interface Command {
    canvasType: CanvasType;
    name: string;
    strokes: Stroke[];
    style: StrokeStyle;
    rectangleStart?: { x: number; y: number };
    rectangleWidth?: number;
    rectangleHeight?: number;
    ellipseStart?: { x: number; y: number };
    centerX?: number;
    centerY?: number;
    radiusX?: number;
    radiusY?: number;
    ellipseHeight?: number;
    ellipseWidth?: number;
    backGroundColor?: string;
}
