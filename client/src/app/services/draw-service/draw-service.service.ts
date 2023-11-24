/* eslint-disable max-lines */
/* eslint-disable max-params */
import { ElementRef, Injectable } from '@angular/core';
import { ClearForegroundCommand } from '@app/classes/commands/clear-foreground-command';
import { DrawCommand } from '@app/classes/commands/draw-command';
import { DrawRectangleCommand } from '@app/classes/commands/draw-rectangle-command';
import { PasteExternalForegroundOnCommand } from '@app/classes/commands/paste-external-foreground-on-command';
import { SwitchForegroundCommand } from '@app/classes/commands/switch-foreground-command';
import { DEFAULT_DRAW_CLIENT, DEFAULT_POSITION_MOUSE_CLIENT, SIZE } from '@app/constants/canvas';
import { Canvas } from '@app/enums/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { Command } from '@app/interfaces/command';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { DrawingCommand } from '@app/interfaces/drawing-command';
import { Line } from '@app/interfaces/line';
import { StrokeStyle } from '@app/interfaces/stroke-style';
import { Vec2 } from '@app/interfaces/vec2';
import { CanvasStateService } from '@app/services/canvas-state/canvas-state.service';
import { PencilService } from '@app/services/pencil-service/pencil.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    $drawingImage: Map<CanvasType, Subject<ImageData>>;

    // Having an index of -1 makes way more sens, because the default index is out of bound.
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    indexOfCommand: number = -1;
    strokeIndex: number = 0;
    commands: DrawingCommand[] = [];
    currentCommand: Command = {
        canvasType: CanvasType.None,
        name: '',
        strokes: [{ lines: [] }],
        style: { color: '', width: 0, cap: 'round', destination: 'source-over' },
    };

    coordDraw: Vec2 = DEFAULT_POSITION_MOUSE_CLIENT;
    isClick: boolean = DEFAULT_DRAW_CLIENT;
    selectedShape: 'Rectangle' | 'Ellipse' | null;
    isDrawingRectangle = false;
    currentHeight: number;
    currentWidth: number;
    animatedFrameID: number;
    startPosRect: { posX: number; posY: number };

    constructor(private canvasStateService: CanvasStateService, private pencil: PencilService) {
        this.$drawingImage = new Map();
    }

    initialize() {
        this.initializeCurrentCommand();
        this.initializePencil();
    }

    startDrawing(event: MouseEvent) {
        this.isClick = true;
        const focusedCanvas = this.canvasStateService.getFocusedCanvas();
        if (focusedCanvas === undefined) return;

        this.coordDraw = this.reposition(focusedCanvas.foreground.nativeElement, event);
        this.setCurrentCommand('', focusedCanvas.canvasType);
        if (this.selectedShape === 'Rectangle') {
            this.isDrawingRectangle = true;
            this.startPosRect = { posX: event.offsetX, posY: event.offsetY };
            this.drawRectangle(event, focusedCanvas.temporary);
            return;
        }
        if (this.pencil.state === Tool.Pencil) {
            this.draw(event);
        } else {
            this.draw(event, true);
        }
    }

    drawEllipse() {
        const focusedCanvas = this.canvasStateService.getFocusedCanvas()?.foreground;
        const ctx = focusedCanvas?.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, focusedCanvas?.nativeElement.width as number, focusedCanvas?.nativeElement.height as number);
        ctx.beginPath();
        // ctx.ellipse(100, 100, 50, 75, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();
    }

    drawRectangle(event: MouseEvent, tempCanvas: ElementRef<HTMLCanvasElement>) {
        if (!this.isDrawingRectangle) return;

        const width = event.offsetX - this.startPosRect.posX;
        const height = event.offsetY - this.startPosRect.posY;

        this.currentWidth = width;
        this.currentHeight = height;

        cancelAnimationFrame(this.animatedFrameID);
        this.animatedFrameID = requestAnimationFrame(() => {
            this.drawRectangleShape(this.coordDraw.x, this.coordDraw.y, width, height, tempCanvas);
        });
    }

    saveRectangle(saveCanvas: ElementRef<HTMLCanvasElement>) {
        const ctx = saveCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = this.pencil.color;
        ctx.fillRect(this.coordDraw.x, this.coordDraw.y, this.currentWidth, this.currentHeight);

        this.updateRectangleCommand();
        this.addCurrentCommand(new DrawRectangleCommand(this.currentCommand, saveCanvas, this));
        this.updateImages();
    }

    drawRectangleShape(startX: number, startY: number, width: number, height: number, focusedCanvas: ElementRef<HTMLCanvasElement>) {
        const ctxTemp = focusedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        ctxTemp.fillStyle = this.pencil.color;
        ctxTemp.fillRect(startX, startY, width, height);
    }

    draw(event: MouseEvent, startOrEndErasing?: boolean) {
        if (!this.isClick) return;

        if (this.selectedShape === 'Rectangle') {
            const focusedCanvas = this.canvasStateService.getFocusedCanvas()?.temporary;
            this.drawRectangle(event, focusedCanvas as ElementRef<HTMLCanvasElement>);
            return;
        }
        const line = this.updateMouseCoordinates(event);
        this.updateCurrentCommand(line, startOrEndErasing ? true : undefined);
        this.createStroke(line, this.currentCommand.style);
        this.updateImages();
    }

    redraw(command: Command) {
        command.strokes.forEach((stroke) => {
            stroke.lines.forEach((line) => {
                this.createStroke(line, command.style, command.canvasType);
            });
        });
    }

    redrawRectangle(command: Command, focusedCanvas: ElementRef<HTMLCanvasElement>) {
        const ctx = focusedCanvas?.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = command.style.color;
        ctx.fillRect(
            command.rectangleStart?.x as number,
            command.rectangleStart?.y as number,
            command.rectangleWidth as number,
            command.rectangleHeight as number,
        );
    }

    stopDrawingRectangle() {
        const saveCanvas = this.canvasStateService.getFocusedCanvas()?.foreground as ElementRef;
        // const redrawCanvas = this.canvasStateService.getFocusedCanvas()?.foreground as ElementRef;
        this.saveRectangle(saveCanvas);
        this.isDrawingRectangle = false;
        this.currentWidth = 0;
        this.currentHeight = 0;
        // this.removeCommandsPastIndex();
    }

    stopDrawing(event: MouseEvent) {
        if (this.selectedShape === 'Rectangle') {
            this.stopDrawingRectangle();
            return;
        }
        this.draw(event, this.pencil.state === Tool.Pencil ? undefined : true);
        this.isClick = false;
        this.currentCommand.name = this.pencil.state === 'Pencil' ? 'draw' : 'erase';
        this.addCurrentCommand(new DrawCommand(this.currentCommand, this), false);
        this.removeCommandsPastIndex();
    }

    leaveCanvas(event: MouseEvent) {
        if (event.buttons === 1) this.stopDrawing(event);
    }

    enterCanvas(event: MouseEvent) {
        if (event.buttons === 1) {
            this.startDrawing(event);
        }
    }

    addDrawingCanvas(canvasType: CanvasType) {
        this.$drawingImage.set(canvasType, new Subject<ImageData>());
    }

    clearBackground(ctxImage: CanvasRenderingContext2D) {
        ctxImage.rect(0, 0, SIZE.x, SIZE.y);
        ctxImage.fillStyle = 'white';
        ctxImage.fill();
    }

    resetBackground(canvasType: CanvasType) {
        if (canvasType === CanvasType.Both) {
            this.clearAllBackground();
            return;
        }
        const canvasState = this.canvasStateService.getCanvasState(canvasType);
        if (canvasState) {
            const background = canvasState.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearBackground(background);
        }
        this.updateImages();
    }

    clearAllBackground() {
        this.canvasStateService.states.forEach((state) => {
            const background = state.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearBackground(background);
        });
        this.updateImages();
    }

    clearAllForegrounds() {
        this.canvasStateService.states.forEach((state) => {
            const foreground = state.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearForeground(foreground);
        });
        this.updateImages();
    }

    clearForeground(ctxCanvas: CanvasRenderingContext2D) {
        ctxCanvas.clearRect(0, 0, Canvas.Width, Canvas.Height);
        this.updateImages();
    }

    resetForeground(canvasType: CanvasType) {
        this.setCurrentCommand('clearForeground', canvasType);
        const canvasState = this.canvasStateService.getCanvasState(canvasType);
        if (canvasState) {
            const foreground = canvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.addCurrentCommand(new ClearForegroundCommand(foreground, this));
        }
        this.updateImages();
    }

    isEraser(pencilState: Tool) {
        return pencilState === Tool.Eraser;
    }

    updateImages() {
        const settings: CanvasRenderingContext2DSettings = { willReadFrequently: true };
        this.canvasStateService.states.forEach((state) => {
            const ctx: CanvasRenderingContext2D = state.temporary.nativeElement.getContext('2d', settings) as CanvasRenderingContext2D;
            ctx.drawImage(state.background.nativeElement, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(state.foreground.nativeElement, 0, 0);
            (this.$drawingImage.get(state.canvasType) as Subject<ImageData>).next(ctx.getImageData(0, 0, Canvas.Width, Canvas.Height));
        });
    }

    switchForegrounds() {
        this.setCurrentCommand('switchForegrounds', CanvasType.Both);
        const leftCanvas = this.canvasStateService.getCanvasState(CanvasType.Left);
        const rightCanvas = this.canvasStateService.getCanvasState(CanvasType.Right);

        if (leftCanvas && rightCanvas) {
            this.addCurrentCommand(new SwitchForegroundCommand(leftCanvas, rightCanvas, this));
        }
    }

    pasteExternalForegroundOn(canvasType: CanvasType) {
        this.setCurrentCommand('pasteExternalForegroundOn', canvasType);

        const leftCanvas = this.canvasStateService.getCanvasState(CanvasType.Left);
        const rightCanvas = this.canvasStateService.getCanvasState(CanvasType.Right);

        if (leftCanvas && rightCanvas) {
            if (canvasType === CanvasType.Left) {
                this.addCurrentCommand(new PasteExternalForegroundOnCommand(leftCanvas, rightCanvas, this));
            } else if (canvasType === CanvasType.Right) {
                this.addCurrentCommand(new PasteExternalForegroundOnCommand(rightCanvas, leftCanvas, this));
            }
        }
    }

    pasteImageDataOn(targetedForeground: DrawingBoardState, selectedForeground: DrawingBoardState) {
        const targetForeground = targetedForeground.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const selectForeground = selectedForeground.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const selectedImageData = selectForeground.getImageData(0, 0, Canvas.Width, Canvas.Height);
        targetForeground.putImageData(selectedImageData, 0, 0);
    }

    clearAllLayers(canvasType: CanvasType) {
        if (!(canvasType === CanvasType.Right || canvasType === CanvasType.Left)) return;
        const canvasState = this.canvasStateService.getCanvasState(canvasType);

        if (canvasState) {
            const background = canvasState.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            const foreground = canvasState.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            this.clearBackground(background);
            this.clearForeground(foreground);
        }
        this.updateImages();
    }

    redo() {
        if (this.indexOfCommand >= this.commands.length - 1) {
            return;
        }
        this.indexOfCommand++;
        this.executeAllCommand();
        this.updateImages();
    }

    undo() {
        // same justification as before
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (this.indexOfCommand <= -1) {
            return;
        }
        this.indexOfCommand--;
        this.executeAllCommand();
        this.updateImages();
    }

    switchForegroundImageData(primaryCanvasState: DrawingBoardState, secondCanvasState: DrawingBoardState) {
        const primaryForeground = primaryCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const secondForeground = secondCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const leftImageData = primaryForeground.getImageData(0, 0, Canvas.Width, Canvas.Height);
        const rightImageData = secondForeground.getImageData(0, 0, Canvas.Width, Canvas.Height);
        primaryForeground.putImageData(rightImageData, 0, 0);
        secondForeground.putImageData(leftImageData, 0, 0);
    }

    private initializeCurrentCommand() {
        this.indexOfCommand = -1;
        this.strokeIndex = 0;
        this.commands = [];
        this.currentCommand = {
            canvasType: CanvasType.None,
            name: '',
            strokes: [{ lines: [] }],
            style: { color: '', width: 0, cap: 'round', destination: 'source-over' },
        };
    }

    private initializePencil() {
        this.pencil.color = '#000000';
        this.pencil.setPencilWidth(1);
        this.pencil.setEraserWidth(2);
        this.pencil.cap = 'round';
        this.pencil.state = Tool.Pencil;
    }

    private createStroke(line: Line, strokeStyle: StrokeStyle, canvasType?: CanvasType) {
        const focusedCanvas = canvasType ? this.canvasStateService.getCanvasState(canvasType) : this.canvasStateService.getFocusedCanvas();
        if (focusedCanvas === undefined) return;
        const ctx: CanvasRenderingContext2D = focusedCanvas.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.globalCompositeOperation = strokeStyle.destination;
        ctx.lineWidth = strokeStyle.width;
        ctx.lineCap = strokeStyle.cap;
        ctx.strokeStyle = strokeStyle.color;
        ctx.moveTo(line.initCoord.x, line.initCoord.y);
        ctx.lineTo(line.finalCoord.x, line.finalCoord.y);
        ctx.stroke();
    }

    private reposition(canvas: HTMLCanvasElement, event: MouseEvent): Vec2 {
        return { x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop };
    }

    private updateRectangleCommand() {
        this.currentCommand.rectangleStart = { x: this.startPosRect.posX, y: this.startPosRect.posY };
        this.currentCommand.rectangleWidth = this.currentWidth;
        this.currentCommand.rectangleHeight = this.currentHeight;
        this.currentCommand.name = 'drawRectangle';
    }

    private updateCurrentCommand(line: Line, didStartErasing?: boolean) {
        const cap = didStartErasing === true ? 'square' : 'round';
        this.currentCommand.strokes[0].lines.push(line);
        this.currentCommand.style = {
            color: this.pencil.color,
            cap,
            width: this.pencil.width,
            destination: this.pencil.state === Tool.Pencil ? 'source-over' : 'destination-out',
        };
    }

    private updateMouseCoordinates(event: MouseEvent): Line {
        const initCoord: Vec2 = { x: this.coordDraw.x, y: this.coordDraw.y };
        const focusedCanvas = this.canvasStateService.getFocusedCanvas();
        if (focusedCanvas) {
            this.coordDraw = this.reposition(focusedCanvas.foreground.nativeElement, event);
        }
        const finalCoord: Vec2 = { x: this.coordDraw.x, y: this.coordDraw.y };
        return { initCoord, finalCoord };
    }

    private executeAllCommand() {
        this.clearAllForegrounds();
        // this.clearAllBackgrounds();
        for (let i = 0; i < this.indexOfCommand + 1; i++) {
            this.commands[i].execute();
        }
    }

    // private clearAllBackgrounds() {
    //     this.canvasStateService.states.forEach((state) => {
    //         const background = state.background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    //         this.clearBackground(background);
    //     });
    //     this.updateImages();
    // }

    private addCurrentCommand(drawingCommand: DrawingCommand, needsToBeExecuted?: boolean) {
        this.indexOfCommand++;
        this.commands[this.indexOfCommand] = drawingCommand;
        if (needsToBeExecuted !== false) {
            drawingCommand.execute();
        }
    }

    private setCurrentCommand(name: string, canvasType: CanvasType) {
        this.currentCommand = {
            canvasType,
            name,
            strokes: [{ lines: [] }],
            style: { color: '', width: 0, cap: 'round', destination: 'source-over' },
        };
    }

    private removeCommandsPastIndex() {
        const commandsToDelete: number = this.commands.length - 1 - this.indexOfCommand;
        if (commandsToDelete > 0) {
            for (let i = 0; i < commandsToDelete; i++) {
                this.commands.pop();
            }
        }
    }
}
