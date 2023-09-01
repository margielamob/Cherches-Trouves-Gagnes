import { Injectable } from '@angular/core';
import { Tool } from '@app/enums/tool';

@Injectable({
    providedIn: 'root',
})
export class PencilService {
    cap: CanvasLineCap = 'round';
    color: string = '#000000';
    state: Tool = Tool.Pencil;
    private pencilWidth: { pencil: number; eraser: number } = { pencil: 1, eraser: 2 };

    get width(): number {
        if (this.state === Tool.Eraser) return this.pencilWidth.eraser;
        return this.pencilWidth.pencil;
    }

    setEraserWidth(width: number): void {
        this.pencilWidth.eraser = width;
    }

    setPencilWidth(width: number): void {
        this.pencilWidth.pencil = width;
    }
}
