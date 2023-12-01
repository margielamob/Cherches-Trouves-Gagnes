/* eslint-disable max-lines */
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClearForegroundCommand } from '@app/classes/commands/clear-foreground-command';
import { PasteExternalForegroundOnCommand } from '@app/classes/commands/paste-external-foreground-on-command';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { Command } from '@app/interfaces/command';
import { DrawingBoardState } from '@app/interfaces/drawing-board-state';
import { Line } from '@app/interfaces/line';
import { Stroke } from '@app/interfaces/stroke';
import { StrokeStyle } from '@app/interfaces/stroke-style';
import { Vec2 } from '@app/interfaces/vec2';
import { CanvasStateService } from '@app/services/canvas-state/canvas-state.service';
import { PencilService } from '@app/services/pencil-service/pencil.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { DrawService } from './draw-service.service';
import { drawingBoardStub, fakeCurrentCommand, fakeLine, fakeMouseEvent, fakeStrokeStyle } from './draw-service.service.spec.constants';

describe('DrawServiceService', () => {
    let service: DrawService;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    let canvasStateServiceSpyObj: jasmine.SpyObj<CanvasStateService>;
    let pencilServiceStub: jasmine.SpyObj<PencilService>;

    beforeEach(() => {
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], { $resetBackground: new Map(), $resetForeground: new Map() });
        canvasStateServiceSpyObj = jasmine.createSpyObj('CanvasStateService', ['getCanvasState', 'getFocusedCanvas']);
        pencilServiceStub = jasmine.createSpyObj('PencilService', ['setPencilWidth', 'setEraserWidth', 'width']);

        TestBed.configureTestingModule({
            providers: [
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
                { provide: CanvasStateService, useValue: canvasStateServiceSpyObj },
                { provide: PencilService, useValue: pencilServiceStub },
            ],
        });
        service = TestBed.inject(DrawService);
        pencilServiceStub.cap = 'round';
        pencilServiceStub.color = '#000000';
        pencilServiceStub.state = Tool.Pencil;
        pencilServiceStub.setEraserWidth(2);
        pencilServiceStub.setPencilWidth(1);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initialize should reinitialize pen attributs', () => {
        const expectedCommand: Command = {
            canvasType: CanvasType.None,
            name: '',
            strokes: [{ lines: [] }],
            style: { color: '', width: 0, cap: 'round', destination: 'source-over' },
        };
        service.initialize();
        expect(service.currentCommand).toEqual(expectedCommand);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(service.indexOfCommand).toEqual(-1);
        expect(service.strokeIndex).toEqual(0);
        expect(service.commands).toEqual([]);
    });

    it('reposition should return a position', () => {
        const expectedReposition = { x: 10, y: 10 };
        expect(service['reposition']({ offsetLeft: 0, offsetTop: 0 } as HTMLCanvasElement, { clientX: 10, clientY: 10 } as MouseEvent)).toEqual(
            expectedReposition,
        );
    });

    it('should reset background for both canvas', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(service, 'updateImages').and.callFake(() => {});
        const spyResetAllBackground = spyOn(service, 'clearAllBackground');
        const spyClearBackground = spyOn(service, 'clearBackground');
        service.resetBackground(CanvasType.Both);
        expect(spyResetAllBackground).toHaveBeenCalled();
        expect(spyClearBackground).not.toHaveBeenCalled();
    });

    it('should reset background for Left background', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(service, 'updateImages').and.callFake(() => {});
        const spyResetAllBackground = spyOn(service, 'clearAllBackground');
        const spyClearBackground = spyOn(service, 'clearBackground');
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            drawingBoardStub.canvasType = CanvasType.Left;
            return drawingBoardStub;
        });
        service.resetBackground(CanvasType.Left);
        expect(spyResetAllBackground).not.toHaveBeenCalled();
        expect(spyClearBackground).toHaveBeenCalled();
    });

    it('should reset background for Right background', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(service, 'updateImages').and.callFake(() => {});
        const spyResetAllBackground = spyOn(service, 'clearAllBackground');
        const spyClearBackground = spyOn(service, 'clearBackground');
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            drawingBoardStub.canvasType = CanvasType.Right;
            return drawingBoardStub;
        });
        service.resetBackground(CanvasType.Right);
        expect(spyResetAllBackground).not.toHaveBeenCalled();
        expect(spyClearBackground).toHaveBeenCalled();
    });

    it('should check if the pencil is in mode eraser', () => {
        expect(service.isEraser(Tool.Eraser)).toBeTrue();
        expect(service.isEraser(Tool.Pencil)).toBeFalse();
    });

    it('should add drawing canvas', () => {
        const spyDrawImage = spyOn(service.$drawingImage, 'set');
        service.addDrawingCanvas(CanvasType.Left);
        expect(spyDrawImage).toHaveBeenCalled();
    });

    it('should reset foreground for left canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(service, 'updateImages').and.callFake(() => {});
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            return drawingBoardStub;
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearForeground = spyOn(service, 'clearForeground').and.callFake(() => {});
        service.resetForeground(CanvasType.Left);
        expect(spyClearForeground).toHaveBeenCalled();
    });

    it('should reset foreground for right canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn(service, 'updateImages').and.callFake(() => {});
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            drawingBoardStub.canvasType = CanvasType.Right;
            return drawingBoardStub;
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearForeground = spyOn(service, 'clearForeground').and.callFake(() => {});
        service.resetForeground(CanvasType.Right);
        expect(spyClearForeground).toHaveBeenCalled();
    });

    it('should update mouse coordinate', () => {
        const expectedFinalCoord = { x: 1, y: 1 };
        const expectedInitCoord = { x: 0, y: 0 };
        service.coordDraw = expectedInitCoord;
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            drawingBoardStub.canvasType = CanvasType.Right;
            return drawingBoardStub;
        });
        spyOn(Object.getPrototypeOf(service), 'reposition').and.callFake(() => expectedFinalCoord);
        expect(service['updateMouseCoordinates']({} as MouseEvent)).toEqual({ initCoord: expectedInitCoord, finalCoord: expectedFinalCoord });
    });

    it('drawPoint should set the style of the pencil and create the point', () => {
        service.coordDraw = { x: 0, y: 0 };
        drawingBoardStub.canvasType = CanvasType.Left;
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => drawingBoardStub);
        pencilServiceStub.cap = 'round';
        pencilServiceStub.color = '#000000';
        pencilServiceStub.state = Tool.Pencil;
        spyOn(Object.getPrototypeOf(service), 'reposition').and.returnValue({ x: 0, y: 0 });
        const ctx = drawingBoardStub.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const beginPathSpy = spyOn(ctx, 'beginPath');
        const moveToSpy = spyOn(ctx, 'moveTo');
        const lineToSpy = spyOn(ctx, 'lineTo');
        const stokeSpy = spyOn(ctx, 'stroke');
        service['createStroke'](fakeLine, {
            width: pencilServiceStub.width,
            cap: pencilServiceStub.cap,
            color: pencilServiceStub.color,
        } as StrokeStyle);
        expect(beginPathSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(stokeSpy).toHaveBeenCalled();
        expect(ctx.lineCap).toEqual(pencilServiceStub.cap);
        expect(ctx.strokeStyle).toEqual(pencilServiceStub.color);
    });

    it('startDrawing should handle mouse event and return undefined if no canvas is in focus', () => {
        service['isClick'] = false;
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return undefined;
        });
        const returnedValue = service.startDrawing({} as MouseEvent);
        expect(returnedValue).toBe(undefined);
        expect(service.isClick).toBeTruthy();
    });

    it('startDrawing should handle mouse event if no canvas is in focus', () => {
        service['isClick'] = false;
        const respositionSpy = spyOn(Object.getPrototypeOf(service), 'reposition');
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return undefined;
        });
        const returnedValue = service.startDrawing({} as MouseEvent);
        expect(returnedValue).toBe(undefined);
        expect(respositionSpy).not.toHaveBeenCalled();
        expect(service.isClick).toBeTruthy();
    });

    it('startDrawing should handle mouse event if a canvas is in focus', () => {
        service['isClick'] = false;
        const newCoord: Vec2 = { x: 0, y: 0 };
        const respositionSpy = spyOn(Object.getPrototypeOf(service), 'reposition').and.callFake(() => {
            return newCoord;
        });
        const setCurrentCommandSpy = spyOn(Object.getPrototypeOf(service), 'setCurrentCommand');
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return drawingBoardStub;
        });

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const drawSpy = spyOn(service, 'draw').and.callFake(() => {});
        const returnedValue = service.startDrawing({} as MouseEvent);
        expect(returnedValue).toBe(undefined);
        expect(respositionSpy).toHaveBeenCalled();
        expect(setCurrentCommandSpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(service.isClick).toBeTruthy();
        expect(service.coordDraw).toBe(newCoord);
    });

    it('startDrawing should handle mouse event if a canvas is in focus', () => {
        service['isClick'] = false;
        const newCoord: Vec2 = { x: 0, y: 0 };
        const respositionSpy = spyOn(Object.getPrototypeOf(service), 'reposition').and.callFake(() => {
            return newCoord;
        });
        const setCurrentCommandSpy = spyOn(Object.getPrototypeOf(service), 'setCurrentCommand');
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return drawingBoardStub;
        });

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const drawSpy = spyOn(service, 'draw').and.callFake(() => {});
        service['pencil'].state = Tool.Pencil;
        const returnedValue = service.startDrawing({} as MouseEvent);
        expect(returnedValue).toBe(undefined);
        expect(respositionSpy).toHaveBeenCalled();
        expect(setCurrentCommandSpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(service.isClick).toBeTruthy();
        expect(service.coordDraw).toBe(newCoord);
    });

    it('startDrawing should handle mouse event if a canvas is in focus', () => {
        service['isClick'] = false;
        const newCoord: Vec2 = { x: 0, y: 0 };
        const respositionSpy = spyOn(Object.getPrototypeOf(service), 'reposition').and.callFake(() => {
            return newCoord;
        });
        const setCurrentCommandSpy = spyOn(Object.getPrototypeOf(service), 'setCurrentCommand');
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return drawingBoardStub;
        });

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const drawSpy = spyOn(service, 'draw').and.callFake(() => {});
        service['pencil'].state = Tool.Eraser;
        const returnedValue = service.startDrawing({} as MouseEvent);
        expect(returnedValue).toBe(undefined);
        expect(respositionSpy).toHaveBeenCalled();
        expect(setCurrentCommandSpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(service.isClick).toBeTruthy();
        expect(service.coordDraw).toBe(newCoord);
    });

    it('updateMouseCoordinate(...) should update return a line according to the given coordinates', () => {
        const line = service['updateMouseCoordinates'](fakeMouseEvent);
        const expectedLine = { x: 0, y: 0 };
        expect(line.finalCoord).toEqual(expectedLine);
        expect(line.finalCoord).toEqual(expectedLine);
    });

    it('updateCurrentCommand(...) should update the current command with squared cap', () => {
        const newLine: Line = {
            initCoord: { x: 0, y: 0 },
            finalCoord: { x: 0, y: 0 },
        };

        const newStroke: Stroke = {
            lines: [newLine],
        };
        const newCurrentCommand: Command = {
            canvasType: CanvasType.None,
            name: 'test',
            strokes: [newStroke],
            style: {} as StrokeStyle,
        };
        pencilServiceStub.state = Tool.Eraser;
        service['currentCommand'] = newCurrentCommand;
        service['updateCurrentCommand'](fakeLine);
        const expectedStyle: StrokeStyle = {
            color: pencilServiceStub.color,
            cap: pencilServiceStub.cap,
            width: pencilServiceStub.width,
            destination: 'destination-out',
        };
        expect(service['currentCommand'].strokes[0].lines[1]).toEqual(fakeLine);
        expect(service['currentCommand'].style).toEqual(expectedStyle);
    });

    it('updateCurrentCommand(...) should update the current command', () => {
        const newLine: Line = {
            initCoord: { x: 0, y: 0 },
            finalCoord: { x: 0, y: 0 },
        };
        const newStroke: Stroke = {
            lines: [newLine],
        };
        const newCurrentCommand: Command = {
            canvasType: CanvasType.None,
            name: 'test',
            strokes: [newStroke],
            style: {} as StrokeStyle,
        };
        pencilServiceStub.state = Tool.Pencil;
        service['currentCommand'] = newCurrentCommand;
        service['updateCurrentCommand'](fakeLine);
        const expectedStyle: StrokeStyle = {
            color: pencilServiceStub.color,
            cap: pencilServiceStub.cap,
            width: pencilServiceStub.width,
            destination: 'source-over',
        };
        expect(service['currentCommand'].strokes[0].lines[1]).toEqual(fakeLine);
        expect(service['currentCommand'].style).toEqual(expectedStyle);
    });

    it('updateCurrentCommand(...) should update the current command with eraser', () => {
        const newLine: Line = {
            initCoord: { x: 0, y: 0 },
            finalCoord: { x: 0, y: 0 },
        };
        const newStroke: Stroke = {
            lines: [newLine],
        };
        const newCurrentCommand: Command = {
            canvasType: CanvasType.None,
            name: 'test',
            strokes: [newStroke],
            style: {} as StrokeStyle,
        };
        pencilServiceStub.state = Tool.Pencil;
        service['currentCommand'] = newCurrentCommand;
        service['updateCurrentCommand'](fakeLine);
        const expectedStyle: StrokeStyle = {
            color: pencilServiceStub.color,
            cap: pencilServiceStub.cap,
            width: pencilServiceStub.width,
            destination: 'source-over',
        };
        expect(service['currentCommand'].strokes[0].lines[1]).toEqual(fakeLine);
        expect(service['currentCommand'].style).toEqual(expectedStyle);
    });

    it('updateCurrentCommand(...) should update the command when didStartErasing has started', () => {
        const newLine: Line = {
            initCoord: { x: 0, y: 0 },
            finalCoord: { x: 0, y: 0 },
        };
        const newStroke: Stroke = {
            lines: [newLine],
        };
        const newCurrentCommand: Command = {
            canvasType: CanvasType.None,
            name: 'test',
            strokes: [newStroke],
            style: {} as StrokeStyle,
        };
        pencilServiceStub.state = Tool.Pencil;
        service['currentCommand'] = newCurrentCommand;
        service['updateCurrentCommand'](fakeLine, true);
        const expectedStyle: StrokeStyle = {
            color: pencilServiceStub.color,
            cap: 'square',
            width: pencilServiceStub.width,
            destination: 'source-over',
        };
        expect(service['currentCommand'].strokes[0].lines[1]).toEqual(fakeLine);
        expect(service['currentCommand'].style).toEqual(expectedStyle);
    });

    it('createStroke(...) should return undefined when the focus canvas is undefined', () => {
        const drawingBoard: DrawingBoardState = {
            canvasType: CanvasType.Left,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            return drawingBoard;
        });
        service['createStroke'](fakeLine, fakeStrokeStyle, CanvasType.Right);
        expect(canvasStateServiceSpyObj.getCanvasState).toHaveBeenCalled();
    });

    it('createStroke(...) should create a stroke with a given canvas', () => {
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            return undefined;
        });
        service['createStroke'](fakeLine, fakeStrokeStyle, CanvasType.Right);
        expect(canvasStateServiceSpyObj.getCanvasState).toHaveBeenCalled();
    });

    it('createStroke(...) should create a stroke without a canvas passed in parameter', () => {
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return drawingBoardStub;
        });
        service['createStroke'](fakeLine, fakeStrokeStyle);
        expect(canvasStateServiceSpyObj.getFocusedCanvas).toHaveBeenCalled();
    });

    it('updateImages(...) should update the context according to the background and the foreground', () => {
        canvasStateServiceSpyObj.states = [drawingBoardStub];
        const states = canvasStateServiceSpyObj.states;
        const spyContextDrawImage = spyOn(states[0].temporary.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'drawImage');
        service.$drawingImage.set(drawingBoardStub.canvasType, new Subject());
        service.updateImages();
        expect(spyContextDrawImage).toHaveBeenCalled();
        expect((states[0].temporary.nativeElement.getContext('2d') as CanvasRenderingContext2D).globalCompositeOperation).toEqual('source-over');
    });

    it('draw(...) should return undefined if the pencil is not clicked', () => {
        service['isClick'] = false;
        const spyOnMouseCoordinate = spyOn(Object.getPrototypeOf(service), 'updateMouseCoordinates');
        service.draw({} as MouseEvent);
        expect(spyOnMouseCoordinate).not.toHaveBeenCalled();
    });

    it('draw(...) should call update current command, create a stroke and update image', () => {
        canvasStateServiceSpyObj.states = [drawingBoardStub];
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return drawingBoardStub;
        });
        service['isClick'] = true;
        service['currentCommand'] = Object.create(fakeCurrentCommand);
        service['updateCurrentCommand'](fakeLine);
        const spyUpdateCurrentCommand = spyOn(Object.getPrototypeOf(service), 'updateCurrentCommand');
        const spyCreateStroke = spyOn(Object.getPrototypeOf(service), 'createStroke');
        const spyUpdateImages = spyOn(service, 'updateImages');
        service.draw(fakeMouseEvent);
        expect(spyUpdateCurrentCommand).toHaveBeenCalled();
        expect(spyCreateStroke).toHaveBeenCalled();
        expect(spyUpdateImages).toHaveBeenCalled();
    });

    it('draw(...) should call update current command, create a stroke and update image', () => {
        canvasStateServiceSpyObj.states = [drawingBoardStub];
        canvasStateServiceSpyObj.getFocusedCanvas.and.callFake(() => {
            return drawingBoardStub;
        });
        service['isClick'] = true;
        service['currentCommand'] = Object.create(fakeCurrentCommand);
        service['updateCurrentCommand'](fakeLine);
        const spyUpdateCurrentCommand = spyOn(Object.getPrototypeOf(service), 'updateCurrentCommand');
        const spyCreateStroke = spyOn(Object.getPrototypeOf(service), 'createStroke');
        const spyUpdateImages = spyOn(service, 'updateImages');
        service.draw(fakeMouseEvent, true);
        expect(spyUpdateCurrentCommand).toHaveBeenCalled();
        expect(spyCreateStroke).toHaveBeenCalled();
        expect(spyUpdateImages).toHaveBeenCalled();
    });

    it('redraw(...) should iterate over all the drawing lines', () => {
        const spyCreateStroke = spyOn(Object.getPrototypeOf(service), 'createStroke');
        const newLine: Line = {
            initCoord: { x: 0, y: 0 },
            finalCoord: { x: 0, y: 0 },
        };
        const newStroke: Stroke = {
            lines: [newLine],
        };
        const newCurrentCommand: Command = {
            canvasType: CanvasType.None,
            name: 'test',
            strokes: [newStroke],
            style: {} as StrokeStyle,
        };
        service.redraw(newCurrentCommand);
        const line = newCurrentCommand.strokes[0].lines[0];
        const style = newCurrentCommand.style;
        const canvasType = newCurrentCommand.canvasType;
        expect(spyCreateStroke).toHaveBeenCalledWith(line, style, canvasType);
    });

    it('stopDrawing(...) should stop the drawing', () => {
        service['isClick'] = true;
        service['pencil'].state = Tool.Pencil;
        service['currentCommand'] = fakeCurrentCommand;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const drawSpy = spyOn(service, 'draw').and.callFake(() => {});
        const spyAddCurrentCommand = spyOn(Object.getPrototypeOf(service), 'addCurrentCommand');
        const spyRemoveCommandsPastIndex = spyOn(Object.getPrototypeOf(service), 'removeCommandsPastIndex');
        service.stopDrawing({ clientX: 10, clientY: 10 } as MouseEvent);
        expect(service['isClick']).toBeFalsy();
        expect(service['currentCommand'].name).toEqual('draw');
        expect(spyAddCurrentCommand).toHaveBeenCalled();
        expect(spyRemoveCommandsPastIndex).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('stopDrawing(...) should stop the erasing', () => {
        service['isClick'] = true;
        service['pencil'].state = Tool.Eraser;
        service['currentCommand'] = fakeCurrentCommand;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const drawSpy = spyOn(service, 'draw').and.callFake(() => {});
        const spyAddCurrentCommand = spyOn(Object.getPrototypeOf(service), 'addCurrentCommand');
        const spyRemoveCommandsPastIndex = spyOn(Object.getPrototypeOf(service), 'removeCommandsPastIndex');
        service.stopDrawing({ clientX: 10, clientY: 10 } as MouseEvent);
        expect(service['isClick']).toBeFalsy();
        expect(service['currentCommand'].name).toEqual('erase');
        expect(spyAddCurrentCommand).toHaveBeenCalled();
        expect(spyRemoveCommandsPastIndex).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('leaveCanvas(...) should stop drawing if already drawing', () => {
        const spyStopDrawing = spyOn(service, 'stopDrawing');
        const fakeMouseButtonEvent = { buttons: 1 } as MouseEvent;
        service.leaveCanvas(fakeMouseButtonEvent);
        expect(spyStopDrawing).toHaveBeenCalled();
    });

    it('leaveCanvas(...) shouldnt do anything if not drawing', () => {
        const spyStopDrawing = spyOn(service, 'stopDrawing');
        const fakeMouseButtonEvent = { buttons: 0 } as MouseEvent;
        service.leaveCanvas(fakeMouseButtonEvent);
        expect(spyStopDrawing).not.toHaveBeenCalled();
    });

    it('enterCanvas(...) should call startDrawing when mouse is clicked', () => {
        const spyStartDrawing = spyOn(service, 'startDrawing');
        const fakeMouseButtonEvent = { buttons: 1 } as MouseEvent;
        service.enterCanvas(fakeMouseButtonEvent);
        expect(spyStartDrawing).toHaveBeenCalledWith(fakeMouseButtonEvent);
    });

    it('enterCanvas(...) should not call startDrawing when mouse is not clicked', () => {
        const spyStartDrawing = spyOn(service, 'startDrawing');
        const fakeMouseButtonEvent = { buttons: 0 } as MouseEvent;
        service.enterCanvas(fakeMouseButtonEvent);
        expect(spyStartDrawing).not.toHaveBeenCalled();
    });

    it('executeAllCommands(...) should iterate through all commands', () => {
        const newCommand = new ClearForegroundCommand({} as CanvasRenderingContext2D, service);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyExecute = spyOn(newCommand, 'execute').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearAllForegrounds = spyOn(service, 'clearAllForegrounds').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearAllBckgrounds = spyOn(service, 'clearAllBackground').and.callFake(() => {});
        service.commands = [newCommand];
        service['indexOfCommand'] = 0;
        service['executeAllCommand']();
        expect(spyExecute).toHaveBeenCalled();
        expect(spyClearAllForegrounds).toHaveBeenCalled();
        expect(spyClearAllBckgrounds).toHaveBeenCalled();
    });

    it('removeCommandsPastIndex(...) should remove all elements past certain index', () => {
        const newCommand = new ClearForegroundCommand({} as CanvasRenderingContext2D, service);
        service.commands = [newCommand, newCommand];
        service['indexOfCommand'] = 0;
        service['removeCommandsPastIndex']();
        expect(service.commands.length).toEqual(1);
    });

    it('removeCommandsPastIndex(...) should remove all elements past certain index', () => {
        service.commands = [];
        service['indexOfCommand'] = -1;
        service['removeCommandsPastIndex']();
        expect(service.commands.length).toEqual(0);
    });

    it('switchForegroundImageData should switch the data from two foreground', () => {
        const firstCanvasState: DrawingBoardState = {
            canvasType: CanvasType.Left,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        const secondCanvasState: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };

        const firstPutImageSpy = spyOn(firstCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'putImageData');
        const firstGetImageSpy = spyOn(firstCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'getImageData');
        const secondPutImageSpy = spyOn(secondCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'putImageData');
        const secondGetImageSpy = spyOn(secondCanvasState.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'getImageData');

        service.switchForegroundImageData(firstCanvasState, secondCanvasState);

        expect(firstGetImageSpy).toHaveBeenCalled();
        expect(firstPutImageSpy).toHaveBeenCalled();
        expect(secondGetImageSpy).toHaveBeenCalled();
        expect(secondPutImageSpy).toHaveBeenCalled();
    });

    it('switchForegrounds(...) should make the right verification before adding command', () => {
        const drawingBoardStubRight: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        const drawingBoardStubLeft: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        canvasStateServiceSpyObj.getCanvasState.and.callFake((canvasType) => {
            if (canvasType === CanvasType.Right) {
                return drawingBoardStubRight;
            } else {
                return drawingBoardStubLeft;
            }
        });
        const spySetCurrentCommand = spyOn(Object.getPrototypeOf(service), 'setCurrentCommand');
        const spyAddCurrentCommand = spyOn(Object.getPrototypeOf(service), 'addCurrentCommand');
        service.switchForegrounds();
        expect(spySetCurrentCommand).toHaveBeenCalledWith('switchForegrounds', CanvasType.Both);
        expect(spyAddCurrentCommand).toHaveBeenCalled();
    });

    it('clearAllBackground(...) should iterate through all backgrounds and clear them all', () => {
        const background = { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>;
        const newBoard: DrawingBoardState = {
            canvasType: CanvasType.None,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        canvasStateServiceSpyObj.states = [newBoard];
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyUpdateImage = spyOn(service, 'updateImages').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyBackground = spyOn(service, 'clearBackground').and.callFake(() => {});
        service.clearAllBackground();
        expect(spyUpdateImage).toHaveBeenCalled();
        expect(spyBackground).toHaveBeenCalledWith(background.nativeElement.getContext('2d') as CanvasRenderingContext2D);
    });

    it('clearBackground(...) should clear a specific background', () => {
        const background = { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>;
        const backgroundCtx = background.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyCtxRect = spyOn(backgroundCtx, 'rect').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyCtxFill = spyOn(backgroundCtx, 'fill').and.callFake(() => {});
        service.clearBackground(backgroundCtx);
        expect(spyCtxFill).toHaveBeenCalled();
        expect(spyCtxRect).toHaveBeenCalled();
        expect(backgroundCtx.fillStyle).toEqual('#ffffff');
    });

    it('clearAllForegrounds(...) should iterate through all foreground and clear them all', () => {
        const foreground = { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>;
        const newBoard: DrawingBoardState = {
            canvasType: CanvasType.None,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            foreground,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        canvasStateServiceSpyObj.states = [newBoard];
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyUpdateImage = spyOn(service, 'updateImages').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyBackground = spyOn(service, 'clearForeground').and.callFake(() => {});
        service.clearAllForegrounds();
        expect(spyUpdateImage).toHaveBeenCalled();
        expect(spyBackground).toHaveBeenCalledWith(foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D);
    });

    it('clearForeground(...) should clear a specific foreground', () => {
        const foreground = { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>;
        const foregroundCtx = foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearRect = spyOn(foregroundCtx, 'clearRect').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyUpdateImages = spyOn(service, 'updateImages').and.callFake(() => {});
        service.clearForeground(foregroundCtx);
        expect(spyClearRect).toHaveBeenCalled();
        expect(spyUpdateImages).toHaveBeenCalled();
    });

    it('pasteExternalForegroundOn(...) should paste an external canvas on the focused canvas', () => {
        const drawingBoardStubRight: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        const drawingBoardStubLeft: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        canvasStateServiceSpyObj.getCanvasState.and.callFake((canvasType) => {
            if (canvasType === CanvasType.Right) {
                return drawingBoardStubRight;
            } else {
                return drawingBoardStubLeft;
            }
        });
        const spySetCurrentCommand = spyOn(Object.getPrototypeOf(service), 'setCurrentCommand');
        const spyAddCurrentCommand = spyOn(Object.getPrototypeOf(service), 'addCurrentCommand');
        service.pasteExternalForegroundOn(CanvasType.Left);
        expect(spySetCurrentCommand).toHaveBeenCalledWith('pasteExternalForegroundOn', CanvasType.Left);
        expect(spyAddCurrentCommand).toHaveBeenCalledWith(new PasteExternalForegroundOnCommand(drawingBoardStubLeft, drawingBoardStubRight, service));
    });

    it('pasteExternalForegroundOn(...) should paste an external canvas on the focused canvas', () => {
        const drawingBoardStubRight: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        const drawingBoardStubLeft: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        canvasStateServiceSpyObj.getCanvasState.and.callFake((canvasType) => {
            if (canvasType === CanvasType.Right) {
                return drawingBoardStubRight;
            } else {
                return drawingBoardStubLeft;
            }
        });
        const spySetCurrentCommand = spyOn(Object.getPrototypeOf(service), 'setCurrentCommand');
        const spyAddCurrentCommand = spyOn(Object.getPrototypeOf(service), 'addCurrentCommand');
        service.pasteExternalForegroundOn(CanvasType.Right);
        expect(spySetCurrentCommand).toHaveBeenCalledWith('pasteExternalForegroundOn', CanvasType.Right);
        expect(spyAddCurrentCommand).toHaveBeenCalledWith(new PasteExternalForegroundOnCommand(drawingBoardStubRight, drawingBoardStubLeft, service));
    });

    it('pasteImageDataOn(...) should replace the image data of a context for a new one', () => {
        const drawingBoardStubRight: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        const drawingBoardStubLeft: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        const spyPutImageData = spyOn(drawingBoardStubLeft.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'putImageData');
        const spyGetImageData = spyOn(drawingBoardStubRight.foreground.nativeElement.getContext('2d') as CanvasRenderingContext2D, 'getImageData');
        service.pasteImageDataOn(drawingBoardStubLeft, drawingBoardStubRight);
        expect(spyPutImageData).toHaveBeenCalled();
        expect(spyGetImageData).toHaveBeenCalled();
    });

    it('clearAllLayers(...) should return if CanvasType is None', () => {
        const spyUpdateImage = spyOn(service, 'updateImages');
        service.clearAllLayers(CanvasType.None);
        expect(canvasStateServiceSpyObj.getCanvasState).not.toHaveBeenCalled();
        expect(spyUpdateImage).not.toHaveBeenCalled();
    });

    it('clearAllLayers(...) should return if CanvasType is Both', () => {
        const spyUpdateImage = spyOn(service, 'updateImages');
        service.clearAllLayers(CanvasType.Both);
        expect(canvasStateServiceSpyObj.getCanvasState).not.toHaveBeenCalled();
        expect(spyUpdateImage).not.toHaveBeenCalled();
    });

    it('clearAllLayers(...) should call functions to clear background and foreground', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyUpdateImage = spyOn(service, 'updateImages').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearForeground = spyOn(service, 'clearForeground').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyClearBackground = spyOn(service, 'clearBackground').and.callFake(() => {});
        const drawingBoardStubRight: DrawingBoardState = {
            canvasType: CanvasType.Right,
            foreground: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            background: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
            temporary: { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>,
        };
        canvasStateServiceSpyObj.getCanvasState.and.callFake(() => {
            return drawingBoardStubRight;
        });
        service.clearAllLayers(CanvasType.Right);
        expect(spyUpdateImage).toHaveBeenCalled();
        expect(spyClearForeground).toHaveBeenCalledWith(drawingBoardStub.background.nativeElement.getContext('2d') as CanvasRenderingContext2D);
        expect(spyClearBackground).toHaveBeenCalledWith(drawingBoardStub.background.nativeElement.getContext('2d') as CanvasRenderingContext2D);
    });

    it('redo(...) should iterate over all of the commands and change the index for the correct one', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyUpdateImages = spyOn(service, 'updateImages').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyExecuteAllCommands = spyOn(Object.getPrototypeOf(service), 'executeAllCommand').and.callFake(() => {});
        const newCommand = new ClearForegroundCommand({} as CanvasRenderingContext2D, service);
        service.commands = [newCommand, newCommand];
        service['indexOfCommand'] = 0;
        service.redo();
        expect(service['indexOfCommand']).toEqual(1);
        expect(spyExecuteAllCommands).toHaveBeenCalled();
        expect(spyUpdateImages).toHaveBeenCalled();
    });

    it('redo(...) should not iterate over elements if its index is greated than the commands lenght', () => {
        const spyExecuteAllCommands = spyOn(Object.getPrototypeOf(service), 'executeAllCommand');
        service['indexOfCommand'] = 0;
        service.redo();
        expect(service['indexOfCommand']).toEqual(0);
        expect(spyExecuteAllCommands).not.toHaveBeenCalled();
    });

    it('undo(...) should iterate over all of the commands and change the index for the correct one', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyExecuteAllCommands = spyOn(Object.getPrototypeOf(service), 'executeAllCommand').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyUpdateImages = spyOn(service, 'updateImages').and.callFake(() => {});
        const newCommand = new ClearForegroundCommand({} as CanvasRenderingContext2D, service);
        service.commands = [newCommand];
        service['indexOfCommand'] = 0;
        service.undo();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(service['indexOfCommand']).toEqual(-1);
        expect(spyExecuteAllCommands).toHaveBeenCalled();
        expect(spyUpdateImages).toHaveBeenCalled();
    });

    it('undo(...) should not iterate over commands if the index is less than 0', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyExecuteAllCommands = spyOn(Object.getPrototypeOf(service), 'executeAllCommand').and.callFake(() => {});
        service['indexOfCommand'] = -1;
        service.undo();
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(service['indexOfCommand']).toEqual(-1);
        expect(spyExecuteAllCommands).not.toHaveBeenCalled();
    });
});
