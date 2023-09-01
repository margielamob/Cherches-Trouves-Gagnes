import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasType } from '@app/enums/canvas-type';
import { AppMaterialModule } from '@app/modules/material.module';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

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
            imports: [MatDialogModule, AppMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
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

    it('should return if the type is bmp', () => {
        const expectedTypeTrue = 'image/bmp';
        const expectedTypeFalse = 'image/png';
        expect(component.isImageTypeCorrect({ type: expectedTypeTrue } as File)).toBeTrue();
        expect(component.isImageTypeCorrect({ type: expectedTypeFalse } as File)).toBeFalse();
    });

    it('should check if the format of the image is 24bits', () => {
        const expectedGoodFormat = 24;
        const expectedWrongFormat = 8;
        expect(component.isImageFormatCorrect(expectedGoodFormat)).toBeTrue();
        expect(component.isImageFormatCorrect(expectedWrongFormat)).toBeFalse();
    });

    it('should check if the image is correct', async () => {
        const lengthData = 30;
        const mockFileData = new Array(lengthData);
        const mockFile = new File(mockFileData, '');
        const spySize = spyOn(component, 'isSizeCorrect').and.resolveTo(true);
        const spyType = spyOn(component, 'isImageTypeCorrect').and.returnValue(true);
        const spyFormat = spyOn(component, 'isImageFormatCorrect').and.returnValue(true);
        expect(await component.isImageCorrect(mockFile)).toBeTrue();
        expect(spySize).toHaveBeenCalled();
        expect(spyType).toHaveBeenCalled();
        expect(spyFormat).toHaveBeenCalled();
        spySize.and.resolveTo(false);
        spyType.and.returnValue(true);
        spyFormat.and.returnValue(false);
        expect(await component.isImageCorrect(mockFile)).toBeFalse();
        spySize.and.resolveTo(true);
        spyType.and.returnValue(false);
        spyFormat.and.returnValue(false);
        expect(await component.isImageCorrect(mockFile)).toBeFalse();
        spySize.and.resolveTo(false);
        spyType.and.returnValue(false);
        spyFormat.and.returnValue(false);
        expect(await component.isImageCorrect(mockFile)).toBeFalse();
        spySize.and.resolveTo(true);
        spyType.and.returnValue(true);
        spyFormat.and.returnValue(false);
        expect(await component.isImageCorrect(mockFile)).toBeFalse();
        spySize.and.resolveTo(false);
        spyType.and.returnValue(true);
        spyFormat.and.returnValue(true);
        expect(await component.isImageCorrect(mockFile)).toBeFalse();
        spySize.and.resolveTo(true);
        spyType.and.returnValue(false);
        spyFormat.and.returnValue(true);
        expect(await component.isImageCorrect(mockFile)).toBeFalse();
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

    it('should manage event to upload an image', async () => {
        const spyImage = spyOn(component, 'isImageCorrect').and.callFake(async () => new Promise((resolve) => resolve(true)));
        const expectedImage = {} as ImageBitmap;
        const spyCreateImage = spyOn(component, 'createImage').and.callFake(async () => new Promise((resolve) => resolve(expectedImage)));
        await component.uploadImage({
            target: {
                files: {
                    item: () => {
                        return {} as File;
                    },
                    length: 1,
                } as FileList,
            } as HTMLInputElement,
        } as unknown as Event);
        expect(spyImage).toHaveBeenCalled();
        expect(spyCreateImage).toHaveBeenCalled();
    });

    it('should manage event to not upload an image if the image doesn t have the good requirement', async () => {
        const spyImage = spyOn(component, 'isImageCorrect').and.callFake(async () => new Promise((resolve) => resolve(false)));
        const expectedImage = {} as ImageBitmap;
        const spyCreateImage = spyOn(component, 'createImage').and.callFake(async () => new Promise((resolve) => resolve(expectedImage)));
        await component.uploadImage({
            target: {
                files: {
                    item: () => {
                        return {} as File;
                    },
                    length: 1,
                } as FileList,
            } as HTMLInputElement,
        } as unknown as Event);
        expect(spyImage).toHaveBeenCalled();
        expect(spyCreateImage).not.toHaveBeenCalled();
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
