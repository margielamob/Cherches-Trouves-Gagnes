import { ElementRef } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { Command } from '@app/interfaces/command';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { Line } from '@app/interfaces/line';
import { Stroke } from '@app/interfaces/stroke';
import { StrokeStyle } from '@app/interfaces/stroke-style';

export const drawingBoardStub: DrawingBoardState = {
    canvasType: CanvasType.None,
    foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
    background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
    temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
};

export const fakeMouseEvent = {
    clientX: 0,
    clientY: 0,
    buttons: 1,
} as MouseEvent;

export const fakeLine: Line = {
    initCoord: { x: 0, y: 0 },
    finalCoord: { x: 0, y: 0 },
};

export const fakeStroke: Stroke = {
    lines: [],
};

export const fakeCurrentCommand: Command = {
    canvasType: CanvasType.None,
    name: 'test',
    strokes: [fakeStroke],
    style: {} as StrokeStyle,
};

export const fakeStrokeStyle: StrokeStyle = {
    color: 'orange',
    cap: 'round',
    destination: 'source-over',
    width: 4,
};
