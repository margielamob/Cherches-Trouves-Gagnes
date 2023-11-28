import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { SIZE } from '@app/constants/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { CanvasStateService } from '@app/services/canvas-state/canvas-state.service';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-draw-canvas',
    templateUrl: './draw-canvas.component.html',
    styleUrls: ['./draw-canvas.component.scss'],
})
export class DrawCanvasComponent implements AfterViewInit, OnDestroy {
    @Input() canvasType: CanvasType;
    @ViewChild('background', { static: false }) private background!: ElementRef<HTMLCanvasElement>;
    @ViewChild('foreground', { static: false }) private foreground!: ElementRef<HTMLCanvasElement>;
    @ViewChild('noContentCanvas', { static: false }) private noContentCanvas!: ElementRef<HTMLCanvasElement>;

    rectangleProperties = {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0,
    };

    constructor(private toolBoxService: ToolBoxService, private drawService: DrawService, private canvasStateService: CanvasStateService) {}

    get width() {
        return SIZE.x;
    }

    get height() {
        return SIZE.y;
    }

    ngAfterViewInit() {
        const currentState: DrawingBoardState = {
            canvasType: this.canvasType,
            foreground: this.foreground,
            background: this.background,
            temporary: this.noContentCanvas,
        };
        this.canvasStateService.states.push(currentState);

        this.toolBoxService.addCanvasType(this.canvasType);

        this.toolBoxService.$uploadImage.get(this.canvasType)?.subscribe((newImage: ImageBitmap) => {
            const background = this.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            background.drawImage(newImage, 0, 0);
            this.drawService.updateImages();
        });

        this.drawService.clearAllLayers(this.canvasType);
        this.drawService.clearAllBackground();
    }

    ngOnDestroy(): void {
        this.canvasStateService.states.pop();
    }

    enterCanvas(event: MouseEvent) {
        this.drawService.enterCanvas(event);
    }

    leaveCanvas(event: MouseEvent) {
        this.drawService.leaveCanvas(event);
    }

    startDrawing(event: MouseEvent) {
        this.canvasStateService.setFocusedCanvas(this.canvasType);
        if (this.isPipette()) {
            this.drawService.updatePencilColor(event);
            return;
        }

        if (this.isBucket()) {
            this.drawService.updateBackgroundColor();
            return;
        }
        this.drawService.startDrawing(event);
    }

    stopDrawing(event: MouseEvent) {
        this.drawService.stopDrawing(event);
    }

    draw(event: MouseEvent) {
        if (this.drawService.isPipette || this.drawService.isBucket) return;
        this.drawService.draw(event);
    }

    isBucket() {
        return this.drawService.isBucket;
    }

    isPipette() {
        return this.drawService.isPipette;
    }

    isDrawingRectangle() {
        return this.drawService.isDrawingRectangle;
    }

    getRectangleSpecs() {
        return this.drawService.getRectangleProps();
    }
}
