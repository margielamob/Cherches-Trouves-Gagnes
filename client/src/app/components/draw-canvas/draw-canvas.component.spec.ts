import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SIZE } from '@app/constants/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { DrawCanvasComponent } from './draw-canvas.component';

describe('DrawCanvasComponent', () => {
    let component: DrawCanvasComponent;
    let fixture: ComponentFixture<DrawCanvasComponent>;
    let drawServiceSpyObj: jasmine.SpyObj<DrawService>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;

    beforeEach(async () => {
        const drawImage = new Map<CanvasType, Subject<ImageData>>();
        const foregroundContext = new Map<CanvasType, HTMLCanvasElement>();
        const uploadImage = new Map<CanvasType, Subject<ImageBitmap>>();
        drawImage.set(CanvasType.Left, new Subject());
        foregroundContext.set(CanvasType.Left, {} as HTMLCanvasElement);
        uploadImage.set(CanvasType.Left, new Subject());
        drawServiceSpyObj = jasmine.createSpyObj(
            'DrawService',
            [
                'reposition',
                'addDrawingCanvas',
                'draw',
                'updateImage',
                'createStroke',
                'resetAllLayers',
                'startDrawing',
                'stopDrawing',
                'clearAllLayers',
                'clearAllBackground',
                'leaveCanvas',
                'enterCanvas',
                'updateImages',
            ],
            {
                $drawingImage: drawImage,
                foregroundContext,
            },
        );

        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', ['addCanvasType'], {
            $uploadImage: uploadImage,
        });

        await TestBed.configureTestingModule({
            declarations: [DrawCanvasComponent],
            providers: [
                { provide: DrawService, useValue: drawServiceSpyObj },
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(DrawCanvasComponent);
        component = fixture.componentInstance;
        component.canvasType = CanvasType.Left;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the width of the canvas', () => {
        expect(component.width).toEqual(SIZE.x);
    });

    it('should get the height of the canvas', () => {
        expect(component.height).toEqual(SIZE.y);
    });

    it('start should change the click state and call to reposition the pointer', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        drawServiceSpyObj.startDrawing.and.callFake(() => {});
        component.startDrawing({} as MouseEvent);
        expect(drawServiceSpyObj.startDrawing).toHaveBeenCalled();
    });

    it('should draw when the client is clicking on the canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-unused-vars
        drawServiceSpyObj.draw.and.callFake((event: MouseEvent) => {});
        component.draw({} as MouseEvent);
        expect(drawServiceSpyObj.draw).toHaveBeenCalled();
    });

    it('should have the current command to eraser', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        drawServiceSpyObj.stopDrawing.and.callFake(() => {});
        component.stopDrawing({ clientX: 10, clientY: 10 } as MouseEvent);
        expect(drawServiceSpyObj.stopDrawing).toHaveBeenCalled();
    });

    it('should call enterCanvas when the client is entering the canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-unused-vars
        drawServiceSpyObj.enterCanvas.and.callFake((event: MouseEvent) => {});
        component.enterCanvas({} as MouseEvent);
        expect(drawServiceSpyObj.enterCanvas).toHaveBeenCalled();
    });

    it('should call leaveCanvas when the client is leaving the canvas', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function, no-unused-vars
        drawServiceSpyObj.leaveCanvas.and.callFake((event: MouseEvent) => {});
        component.leaveCanvas({} as MouseEvent);
        expect(drawServiceSpyObj.leaveCanvas).toHaveBeenCalled();
    });

    it('should upload image', () => {
        component['background'] = {
            nativeElement: {
                getContext: () => {
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    return { drawImage: () => {} } as unknown as CanvasRenderingContext2D;
                },
            } as unknown as HTMLCanvasElement,
        };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        drawServiceSpyObj.updateImages.and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Left)?.subscribe(() => {
            expect(drawServiceSpyObj.updateImages).toHaveBeenCalled();
        });
        component.ngAfterViewInit();
        toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Left)?.next({} as ImageBitmap);
    });
});
