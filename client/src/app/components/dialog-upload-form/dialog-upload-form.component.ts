import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BMP_HEADER_OFFSET, FORMAT_IMAGE, IMAGE_TYPE, SIZE } from '@app/constants/canvas';
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
    isPropertiesImageCorrect: ImageCorrect = { size: true, type: true, format: true };
    isFormSubmitted: boolean = false;
    private img: ImageBitmap;

    constructor(@Inject(MAT_DIALOG_DATA) public data: { canvas: CanvasType }, private toolService: ToolBoxService) {}

    async uploadImage(event: Event) {
        const files: FileList = (event.target as HTMLInputElement).files as FileList;
        this.isFormSubmitted = await this.isImageCorrect(files[0]);
        if (files === null || !this.isFormSubmitted) {
            return;
        }

        this.img = await this.createImage(files[0]);
    }

    isImageFormatCorrect(bmpFormat: number) {
        return (this.isPropertiesImageCorrect.format = bmpFormat === FORMAT_IMAGE);
    }

    async isImageCorrect(file: File): Promise<boolean> {
        const bmpHeader = new DataView(await file.arrayBuffer());
        return (
            (await this.isSizeCorrect(file)) &&
            this.isImageTypeCorrect(file) &&
            this.isImageFormatCorrect(bmpHeader.getUint16(BMP_HEADER_OFFSET, true))
        );
    }

    async createImage(file: File): Promise<ImageBitmap> {
        return await createImageBitmap(file.slice());
    }

    isImageTypeCorrect(file: File): boolean {
        return (this.isPropertiesImageCorrect.type = file.type === IMAGE_TYPE);
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
}
