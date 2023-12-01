/* eslint-disable max-lines */
/* eslint-disable max-params */
import { ElementRef, Injectable } from '@angular/core';
import { ChangeBackgroundCommand } from '@app/classes/commands/change-background-command';
import { ClearForegroundCommand } from '@app/classes/commands/clear-foreground-command';
import { DrawCommand } from '@app/classes/commands/draw-command';
import { DrawEllipseCommand } from '@app/classes/commands/draw-ellipse-command';
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
import { BehaviorSubject, Subject } from 'rxjs';
import { DrawingToolsService } from './drawing-tools.service';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    $drawingImage: Map<CanvasType, Subject<ImageData>>;
    inputColorChanged: BehaviorSubject<string> = new BehaviorSubject('');
    inputColorChanged$ = this.inputColorChanged.asObservable();

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
    isDrawingRectangle = false;
    isDrawingEllipse = false;
    isPipette: boolean = false;
    isBucket: boolean = false;
    currentHeight: number;
    currentWidth: number;
    animatedFrameID: number;
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    startPos: { posX: number; posY: number };

    rectangleProperties = {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0,
    };

    constructor(private canvasStateService: CanvasStateService, private pencil: PencilService, private drawTools: DrawingToolsService) {
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

        if (this.pencil.state === Tool.Rectangle) {
            this.isDrawingRectangle = true;
            this.startPos = { posX: event.offsetX, posY: event.offsetY };
            this.rectangleProperties.startX = this.startPos.posX;
            this.rectangleProperties.startY = this.startPos.posY;

            this.drawRectangle(event, focusedCanvas.temporary);
            return;
        }

        if (this.pencil.state === Tool.Ellipse) {
            this.isDrawingEllipse = true;
            this.startPos = { posX: event.offsetX, posY: event.offsetY };
            this.drawEllipse(event, focusedCanvas.temporary);
            return;
        }
        if (this.pencil.state === Tool.Pencil) {
            this.draw(event);
        } else {
            this.draw(event, true);
        }
    }

    drawEllipse(event: MouseEvent, tempCanvas: ElementRef<HTMLCanvasElement>) {
        if (!this.isDrawingEllipse) return;

        const width = event.offsetX - this.startPos.posX;
        const height = event.offsetY - this.startPos.posY;

        this.currentWidth = width;
        this.currentHeight = height;

        cancelAnimationFrame(this.animatedFrameID);
        this.animatedFrameID = requestAnimationFrame(() => {
            this.drawEllipseShape(this.startPos.posX, this.startPos.posY, width, height, tempCanvas);
        });
    }

    updatePencilColor(event: MouseEvent) {
        const tempCanvas = this.canvasStateService.getFocusedCanvas()?.temporary as ElementRef<HTMLCanvasElement>;
        const foreground = this.canvasStateService.getFocusedCanvas()?.foreground as ElementRef<HTMLCanvasElement>;
        const background = this.canvasStateService.getFocusedCanvas()?.background as ElementRef<HTMLCanvasElement>;

        const ctx = tempCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        ctx.drawImage(background.nativeElement, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(foreground.nativeElement, 0, 0);

        this.pencil.color = this.drawTools.getColor(event.offsetX, event.offsetY, ctx);
        this.inputColorChanged.next(this.pencil.color);
    }

    updateBackgroundColor() {
        const canvas = this.canvasStateService.getFocusedCanvas()?.background as ElementRef<HTMLCanvasElement>;

        const color = this.pencil.color;

        this.drawTools.setBackgroundColor(color, canvas);

        const command = {
            backGroundColor: color,
            name: 'background' + this.indexOfCommand,
        } as Command;

        this.addCurrentCommand(new ChangeBackgroundCommand(command, canvas, this), false);
        this.removeCommandsPastIndex();
        this.updateImages();
    }

    redoBackgroundChange(command: Command, canvas: ElementRef<HTMLCanvasElement>) {
        this.drawTools.setBackgroundColor(command.backGroundColor as string, canvas);
    }

    saveEllipse(saveCanvas: ElementRef<HTMLCanvasElement>) {
        const ctx = saveCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = this.pencil.color;
        ctx.strokeStyle = this.pencil.color;

        this.currentCommand.centerX = this.centerX;
        this.currentCommand.centerY = this.centerY;
        this.currentCommand.radiusX = this.radiusX;
        this.currentCommand.radiusY = this.radiusY;
        this.currentCommand.ellipseHeight = this.currentHeight;
        this.currentCommand.ellipseWidth = this.currentWidth;

        this.currentCommand.ellipseStart = { x: this.startPos.posX, y: this.startPos.posY };
        this.currentCommand.name = 'drawEllipse';

        ctx.beginPath();
        ctx.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        this.addCurrentCommand(new DrawEllipseCommand(this.currentCommand, saveCanvas, this));
        this.updateImages();
    }

    drawEllipseShape(startX: number, startY: number, width: number, height: number, focusedCanvas: ElementRef<HTMLCanvasElement>) {
        const ctxTemp = focusedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        ctxTemp.fillStyle = this.pencil.color;
        ctxTemp.strokeStyle = this.pencil.color;

        this.centerX = startX + width / 2;
        this.centerY = startY + height / 2;
        this.radiusX = Math.abs(width) / 2;
        this.radiusY = Math.abs(height) / 2;

        ctxTemp.clearRect(0, 0, focusedCanvas.nativeElement.width, focusedCanvas.nativeElement.height);
        ctxTemp.beginPath();
        ctxTemp.ellipse(this.centerX, this.centerY, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);

        ctxTemp.fill();
        ctxTemp.stroke();
    }

    drawRectangle(event: MouseEvent, tempCanvas: ElementRef<HTMLCanvasElement>) {
        if (!this.isDrawingRectangle) return;
        const width = event.offsetX - this.startPos.posX;
        const height = event.offsetY - this.startPos.posY;

        this.currentWidth = width;
        this.currentHeight = height;

        this.rectangleProperties.width = width;
        this.rectangleProperties.height = height;

        cancelAnimationFrame(this.animatedFrameID);
        this.animatedFrameID = requestAnimationFrame(() => {
            this.drawRectangleShape(this.coordDraw.x, this.coordDraw.y, width, height, tempCanvas);
        });
    }
    clearPreviousRectangle(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(this.coordDraw.x, this.coordDraw.y, this.currentWidth, this.currentHeight);
    }

    drawRectangleShape(startX: number, startY: number, width: number, height: number, focusedCanvas: ElementRef<HTMLCanvasElement>) {
        const ctxTemp = focusedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctxTemp.clearRect(0, 0, focusedCanvas.nativeElement.width, focusedCanvas.nativeElement.height);
        ctxTemp.fillStyle = this.pencil.color;
        ctxTemp.fillRect(startX, startY, width, height);
    }

    draw(event: MouseEvent, startOrEndErasing?: boolean) {
        if (!this.isClick) return;

        if (this.pencil.state === Tool.Rectangle) {
            const focusedCanvas = this.canvasStateService.getFocusedCanvas()?.temporary;
            this.drawRectangle(event, focusedCanvas as ElementRef<HTMLCanvasElement>);
            return;
        }

        if (this.pencil.state === Tool.Ellipse) {
            const focusedCanvas = this.canvasStateService.getFocusedCanvas()?.temporary;
            this.drawEllipse(event, focusedCanvas as ElementRef<HTMLCanvasElement>);
            return;
        }

        const line = this.updateMouseCoordinates(event);
        this.updateCurrentCommand(line, startOrEndErasing ? true : undefined);
        this.createStroke(line, this.currentCommand.style);
        this.updateImages();
    }

    getRectangleProps() {
        return this.rectangleProperties;
    }

    redraw(command: Command) {
        command.strokes.forEach((stroke) => {
            stroke.lines.forEach((line) => {
                this.createStroke(line, command.style, command.canvasType);
            });
        });
    }

    redrawRectangle(command: Command, focusedCanvas: ElementRef<HTMLCanvasElement>, fillColor: string) {
        const ctx = focusedCanvas?.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = fillColor;
        ctx.fillRect(
            command.rectangleStart?.x as number,
            command.rectangleStart?.y as number,
            command.rectangleWidth as number,
            command.rectangleHeight as number,
        );
    }

    redrawEllipse(command: Command, focusedCanvas: ElementRef<HTMLCanvasElement>) {
        const ctx = focusedCanvas?.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = command.style.color;
        ctx.strokeStyle = command.style.color;

        ctx.beginPath();
        ctx.ellipse(command.centerX as number, command.centerY as number, command.radiusX as number, command.radiusY as number, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    saveRectangle(saveCanvas: ElementRef<HTMLCanvasElement>) {
        const ctx = saveCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = this.pencil.color;
        ctx.fillRect(this.coordDraw.x, this.coordDraw.y, this.currentWidth, this.currentHeight);
        this.updateRectangleCommand();
        this.addCurrentCommand(new DrawRectangleCommand(this.currentCommand, saveCanvas, ctx.fillStyle, this));
        this.updateImages();
    }

    stopDrawingRectangle() {
        const saveCanvas = this.canvasStateService.getFocusedCanvas()?.foreground as ElementRef;
        this.saveRectangle(saveCanvas);
        this.isDrawingRectangle = false;
        this.removeCommandsPastIndex();
        this.isClick = false;
    }

    stopDrawingEllipse() {
        const saveCanvas = this.canvasStateService.getFocusedCanvas()?.foreground as ElementRef;
        this.saveEllipse(saveCanvas);
        this.isDrawingEllipse = false;
        this.removeCommandsPastIndex();
        this.isClick = false;
    }

    stopDrawing(event: MouseEvent) {
        if (this.pencil.state === Tool.Rectangle) {
            this.stopDrawingRectangle();
            return;
        }

        if (this.pencil.state === Tool.Ellipse) {
            this.stopDrawingEllipse();
            return;
        }

        if (this.isBucket) {
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
        this.currentCommand.rectangleStart = { x: this.startPos.posX, y: this.startPos.posY };
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
        this.clearAllBackground();
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
