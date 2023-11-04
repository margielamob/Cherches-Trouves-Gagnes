import { HttpClient, HttpClientModule, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpLoaderFactory } from '@app/app.module';
import { CentralBoxComponent } from '@app/components/central-tool-box/central-tool-box.component';
import { CommonToolBoxComponent } from '@app/components/common-tool-box/common-tool-box.component';
import { DialogCreateGameComponent } from '@app/components/dialog-create-game/dialog-create-game.component';
import { DrawCanvasComponent } from '@app/components/draw-canvas/draw-canvas.component';
import { ExitGameButtonComponent } from '@app/components/exit-game-button/exit-game-button.component';
import { LoadingScreenComponent } from '@app/components/loading-screen/loading-screen.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { ToolBoxComponent } from '@app/components/tool-box/tool-box.component';
import { CanvasType } from '@app/enums/canvas-type';
import { AppMaterialModule } from '@app/modules/material.module';
import { CanvasEventHandlerService } from '@app/services/canvas-event-handler/canvas-event-handler.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { LanguageService } from '@app/services/language-service/languag.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateGamePageComponent } from './create-game-page.component';

describe('CreateGamePageComponent', () => {
    let component: CreateGamePageComponent;
    let fixture: ComponentFixture<CreateGamePageComponent>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    let communicationSpyObject: jasmine.SpyObj<CommunicationService>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    let drawServiceSpyObj: jasmine.SpyObj<DrawService>;
    let canvasEventHandlerSpyObj: jasmine.SpyObj<CanvasEventHandlerService>;
    let langServiceSpyObj: jasmine.SpyObj<LanguageService>;
    beforeEach(async () => {
        const drawImageSubjects = new Map();
        drawImageSubjects.set(CanvasType.Left, new Subject());
        dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
        communicationSpyObject = jasmine.createSpyObj('CommunicationService', ['validateGame']);
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', ['addCanvasType'], {
            $uploadImage: new Map<CanvasType, Subject<ImageBitmap>>(),
            $resetBackground: new Map<CanvasType, Subject<void>>(),
            $switchForeground: new Map<CanvasType, Subject<void>>(),
            $resetForeground: new Map<CanvasType, Subject<void>>(),
        });
        canvasEventHandlerSpyObj = jasmine.createSpyObj('CanvasEventHandlerService', ['handleCtrlShiftZ', 'handleCtrlZ']);
        drawServiceSpyObj = jasmine.createSpyObj(
            'DrawService',
            ['addDrawingCanvas', 'resetAllLayers', 'clearAllLayers', 'clearAllBackground', 'initialize'],
            {
                $drawingImage: drawImageSubjects,
                foregroundContext: new Map(),
            },
        );
        await TestBed.configureTestingModule({
            declarations: [
                CreateGamePageComponent,
                DrawCanvasComponent,
                ToolBoxComponent,
                DialogCreateGameComponent,
                PageHeaderComponent,
                ExitGameButtonComponent,
                LoadingScreenComponent,
                CommonToolBoxComponent,
                CentralBoxComponent,
            ],
            imports: [
                AppMaterialModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                HttpClientModule,
                AngularFireModule.initializeApp(environment.firebase),
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            providers: [
                { provide: MatDialog, useValue: dialogSpyObj },
                { provide: CommunicationService, useValue: communicationSpyObject },
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
                { provide: DrawService, useValue: drawServiceSpyObj },
                { provide: CanvasEventHandlerService, useValue: canvasEventHandlerSpyObj },
                { provide: LanguageService, useValue: langServiceSpyObj },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateGamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should not submit the form and open dialog if it s invalid', () => {
    //     component.form = {
    //         valid: false,
    //         controls: { test: { valid: false } as FormControl, test1: { valid: true } as FormControl },
    //     } as unknown as FormGroup;
    //     const expectedErrorMessages = 'test is not valid';
    //     component.manageErrorInForm(expectedErrorMessages);
    //     expect(dialogSpyObj.open).toHaveBeenCalledWith(DialogFormsErrorComponent, {
    //         data: { formTitle: 'Create Game Form', errorMessages: [expectedErrorMessages] },
    //     });
    // });

    it('should open a dialog to validate the game settings', async () => {
        component.validateForm(0, [0]);
        expect(dialogSpyObj.open).toHaveBeenCalled();
    });

    it('should open the validate dialog if the form is valid', async () => {
        spyOnProperty(component.form, 'valid').and.returnValue(true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const validateFormSpy = spyOn(component, 'validateForm').and.callFake(() => {});
        communicationSpyObject.validateGame.and.callFake(() => {
            return of({ body: { numberDifference: 0, data: [0], height: 1, width: 1 } } as HttpResponse<{
                numberDifference: number;
                width: number;
                height: number;
                data: number[];
            }>);
        });
        component.isGameValid();
        expect(validateFormSpy).toHaveBeenCalled();
    });

    it('should not open the validate dialog if the form is not valid and body is null', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const validateFormSpy = spyOn(component, 'validateForm').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const manageErrorFormFormSpy = spyOn(component, 'manageErrorInForm').and.callFake(() => {});
        communicationSpyObject.validateGame.and.callFake(() => {
            return of({ body: null } as HttpResponse<{
                numberDifference: number;
                width: number;
                height: number;
                data: number[];
            }>);
        });
        component.isGameValid();
        expect(validateFormSpy).not.toHaveBeenCalled();
        expect(manageErrorFormFormSpy).toHaveBeenCalled();
    });

    it('should not open the validate dialog if the form is not valid and response is null', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const validateFormSpy = spyOn(component, 'validateForm').and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const manageErrorFormFormSpy = spyOn(component, 'manageErrorInForm').and.callFake(() => {});
        communicationSpyObject.validateGame.and.callFake(() => of(null));
        component.isGameValid();
        expect(validateFormSpy).not.toHaveBeenCalled();
        expect(manageErrorFormFormSpy).toHaveBeenCalled();
    });

    it('should do not validate the form if the response is undefined', () => {
        const validateFormSpy = spyOn(component, 'validateForm');
        communicationSpyObject.validateGame.and.returnValue(
            of({} as HttpResponse<{ numberDifference: number; width: number; height: number; data: number[] }>),
        );
        component.isGameValid();
        expect(validateFormSpy).not.toHaveBeenCalled();
    });

    it('should do not validate the form if the response is undefined', () => {
        const validateFormSpy = spyOn(component, 'validateForm');
        communicationSpyObject.validateGame.and.returnValue(
            of({} as HttpResponse<{ numberDifference: number; width: number; height: number; data: number[] }>),
        );
        component.isGameValid();
        expect(validateFormSpy).not.toHaveBeenCalled();
    });

    it('should add new image ', () => {
        const spySetDrawingImage = spyOn(component.drawingImage as Map<CanvasType, ImageData>, 'set');
        drawServiceSpyObj.$drawingImage.get(CanvasType.Left)?.next({} as ImageData);
        expect(spySetDrawingImage).toHaveBeenCalled();
    });

    it('should handleCtrlShiftZ if key down', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        canvasEventHandlerSpyObj.handleCtrlShiftZ.and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        canvasEventHandlerSpyObj.handleCtrlZ.and.callFake(() => {});
        component.keyEvent({ ctrlKey: true, key: 'Z', shiftKey: true } as KeyboardEvent);
        expect(canvasEventHandlerSpyObj.handleCtrlShiftZ).toHaveBeenCalled();
        expect(canvasEventHandlerSpyObj.handleCtrlZ).not.toHaveBeenCalled();
    });

    it('should handleCtrlZ if key down', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        canvasEventHandlerSpyObj.handleCtrlShiftZ.and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        canvasEventHandlerSpyObj.handleCtrlZ.and.callFake(() => {});
        component.keyEvent({ ctrlKey: true, key: 'z', shiftKey: false } as KeyboardEvent);
        expect(canvasEventHandlerSpyObj.handleCtrlShiftZ).not.toHaveBeenCalled();
        expect(canvasEventHandlerSpyObj.handleCtrlZ).toHaveBeenCalled();
    });

    it('should not handle control if it s not shiftKey or control z', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        canvasEventHandlerSpyObj.handleCtrlShiftZ.and.callFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        canvasEventHandlerSpyObj.handleCtrlZ.and.callFake(() => {});
        component.keyEvent({} as KeyboardEvent);
        expect(canvasEventHandlerSpyObj.handleCtrlShiftZ).not.toHaveBeenCalled();
        expect(canvasEventHandlerSpyObj.handleCtrlZ).not.toHaveBeenCalled();
        component.keyEvent({ ctrlKey: true, key: 'a' } as KeyboardEvent);
        expect(canvasEventHandlerSpyObj.handleCtrlShiftZ).not.toHaveBeenCalled();
        expect(canvasEventHandlerSpyObj.handleCtrlZ).not.toHaveBeenCalled();
        component.keyEvent({ ctrlKey: true, key: 'A' } as KeyboardEvent);
        expect(canvasEventHandlerSpyObj.handleCtrlShiftZ).not.toHaveBeenCalled();
        expect(canvasEventHandlerSpyObj.handleCtrlZ).not.toHaveBeenCalled();
    });
});
