import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMAGE_BMP, IMAGE_JPG, IMAGE_PNG, SIZE } from '@app/constants/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { ImageCorrect } from '@app/interfaces/image-correct';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-dialog-upload-form',
    templateUrl: './dialog-upload-form.component.html',
    styleUrls: ['./dialog-upload-form.component.scss'],
})
export class DialogUploadFormComponent {
    isPropertiesImageCorrect: ImageCorrect = { size: true, type: true };
    isFormSubmitted: boolean = false;
    allowedFormats = [IMAGE_JPG, IMAGE_BMP, IMAGE_PNG];

    private img: ImageBitmap;

    constructor(@Inject(MAT_DIALOG_DATA) public data: { canvas: CanvasType }, private toolService: ToolBoxService) {}

    async uploadImage(event: Event) {
        const files: FileList = (event.target as HTMLInputElement).files as FileList;
        const file = files[0];

        this.isFormSubmitted = await this.isImageCorrect(file);
        if (files === null || !this.isFormSubmitted) {
            return;
        }

        this.img = await this.createImage(file);
    }

    async isImageCorrect(file: File): Promise<boolean> {
        return (await this.isSizeCorrect(file)) && this.isImageTypeCorrect(file);
    }

    async createImage(file: File): Promise<ImageBitmap> {
        return await createImageBitmap(file.slice());
    }

    isImageTypeCorrect(file: File): boolean {
        this.isPropertiesImageCorrect.type = this.isFileSupported(file);
        return this.isPropertiesImageCorrect.type;
    }

    async isSizeCorrect(file: File): Promise<boolean> {
        const img = await this.createImage(file);

        return (this.isPropertiesImageCorrect.size = img.width === SIZE.x && img.height === SIZE.y);
    }

    onSubmit(): void {
        if (!this.isFormSubmitted || !this.data.canvas) {
            return;
        }
        if (this.data.canvas === CanvasType.Both) {
            this.toolService.$uploadImage.forEach((event: Subject<ImageBitmap>) => {
                event.next(this.img);
            });
            return;
        }
        (this.toolService.$uploadImage.get(this.data.canvas) as Subject<ImageBitmap>).next(this.img);
    }

    isFileSupported(file: File) {
        return this.allowedFormats.includes(file.type);
    }
}
