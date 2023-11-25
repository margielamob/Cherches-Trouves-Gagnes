import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasType } from '@app/enums/canvas-type';
import { AppMaterialModule } from '@app/modules/material.module';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DialogUploadFormComponent } from './dialog-upload-form.component';

describe('DialogUploadFormComponent', () => {
    let component: DialogUploadFormComponent;
    let fixture: ComponentFixture<DialogUploadFormComponent>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    let drawServiceSpyObj: jasmine.SpyObj<DrawService>;
    const model = { canvas: CanvasType.Both };
    beforeEach(async () => {
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', [], { $uploadImage: new Map() });
        drawServiceSpyObj = jasmine.createSpyObj('DrawService', ['isCanvasSelected']);
        await TestBed.configureTestingModule({
            declarations: [DialogUploadFormComponent],
            providers: [
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
                { provide: MAT_DIALOG_DATA, useValue: model },
                { provide: DrawService, useValue: drawServiceSpyObj },
            ],
            imports: [
                MatDialogModule,
                AppMaterialModule,
                BrowserAnimationsModule,
                ReactiveFormsModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogUploadFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        toolBoxServiceSpyObj.$uploadImage.set(CanvasType.Left, new Subject());
        toolBoxServiceSpyObj.$uploadImage.set(CanvasType.Right, new Subject());
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create a image from a file stream', async () => {
        const expectedImage = {} as ImageBitmap;
        const createImageSpy = spyOn(window, 'createImageBitmap').and.resolveTo(expectedImage);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const image = await component.createImage({ slice: () => {} } as File);
        expect(createImageSpy).toHaveBeenCalled();
        expect(image).toEqual(expectedImage);
    });

    it('should check the size of the image', async () => {
        const expectedSize = { width: 640, height: 480 };
        const spyCreateImage = spyOn(component, 'createImage').and.resolveTo(expectedSize as ImageBitmap);
        expect(await component.isSizeCorrect({} as File)).toBeTrue();
        let notExpectedSize = { width: 600, height: 400 };
        spyCreateImage.and.resolveTo(notExpectedSize as ImageBitmap);
        expect(await component.isSizeCorrect({} as File)).toBeFalse();
        notExpectedSize = { width: 600, height: 400 };
        spyCreateImage.and.resolveTo(notExpectedSize as ImageBitmap);
        expect(await component.isSizeCorrect({} as File)).toBeFalse();
        notExpectedSize = { width: 600, height: 400 };
        spyCreateImage.and.resolveTo(notExpectedSize as ImageBitmap);
        expect(await component.isSizeCorrect({} as File)).toBeFalse();
    });

    it('should not submit a form because the type is not good', async () => {
        const spyDiff = spyOn(toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Left) as Subject<ImageBitmap>, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Right) as Subject<ImageBitmap>, 'next');
        component.onSubmit();
        expect(spyDiff).not.toHaveBeenCalled();
        expect(spySource).not.toHaveBeenCalled();
    });

    it('should submit a form because the type is both', async () => {
        component.data.canvas = CanvasType.Both;
        component.isFormSubmitted = true;
        const spyDiff = spyOn(toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Left) as Subject<ImageBitmap>, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Right) as Subject<ImageBitmap>, 'next');
        toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Left)?.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component['img']);
        });
        toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Right)?.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component['img']);
        });
        component.onSubmit();
        expect(spyDiff).toHaveBeenCalled();
        expect(spySource).toHaveBeenCalled();
    });

    it('should submit a form because the type is difference', async () => {
        component.data.canvas = CanvasType.Left;
        component.isFormSubmitted = true;
        const spyDiff = spyOn(toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Left) as Subject<ImageBitmap>, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Right) as Subject<ImageBitmap>, 'next');
        toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Left)?.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component['img']);
        });
        component.onSubmit();
        expect(spyDiff).toHaveBeenCalled();
        expect(spySource).not.toHaveBeenCalled();
    });

    it('should submit a form because the type is source', async () => {
        component.data.canvas = CanvasType.Right;
        component.isFormSubmitted = true;
        const spyDiff = spyOn(toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Left) as Subject<ImageBitmap>, 'next');
        const spySource = spyOn(toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Right) as Subject<ImageBitmap>, 'next');
        toolBoxServiceSpyObj.$uploadImage.get(CanvasType.Right)?.subscribe((newImage: ImageBitmap) => {
            expect(newImage).toEqual(component['img']);
        });
        component.onSubmit();
        expect(spyDiff).not.toHaveBeenCalled();
        expect(spySource).toHaveBeenCalled();
    });
});
