import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';

export interface CropperDialogData {
    image: File;
    width: number;
    height: number;
}

@Component({
    selector: 'app-cropper-dialog',
    templateUrl: './cropper-dialog.component.html',
    styleUrls: ['./cropper-dialog.component.scss'],
})
export class CropperDialogComponent {
    file: File;
    constructor(@Inject(MAT_DIALOG_DATA) public data: CropperDialogData) {}
    submitCrop(event: ImageCroppedEvent) {
        const { blob, objectUrl } = event;
        if (blob && objectUrl) {
            this.file = this.createFile(this.data.image.name, this.data.image.type, blob);
        }
    }

    private createFile(fileName: string, imageType: string, blob: Blob): File {
        const options: FilePropertyBag = { type: imageType };
        return new File([blob], fileName, options);
    }
}
