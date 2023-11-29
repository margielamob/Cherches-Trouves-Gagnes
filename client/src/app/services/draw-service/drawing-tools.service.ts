import { ElementRef, Injectable } from '@angular/core';

export const FF = 255;
@Injectable({
    providedIn: 'root',
})
export class DrawingToolsService {
    setBackgroundColor(color: string, canvas: ElementRef<HTMLCanvasElement>) {
        const ctx = canvas.nativeElement?.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.nativeElement.width, canvas.nativeElement.height);
    }

    getColor(x: number, y: number, ctx: CanvasRenderingContext2D) {
        return this.pixelToRGBA(ctx.getImageData(x, y, 1, 1) as ImageData);
    }

    private pixelToRGBA(pixel: ImageData) {
        return `rgba(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]}, ${pixel.data[3] / FF})`;
    }
}
