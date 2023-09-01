import { Injectable } from '@angular/core';
import { CanvasType } from '@app/enums/canvas-type';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolBoxService {
    $uploadImage: Map<CanvasType, Subject<ImageBitmap>>;

    constructor() {
        this.$uploadImage = new Map();
    }

    addCanvasType(canvasType: CanvasType) {
        this.$uploadImage.set(canvasType, new Subject<ImageBitmap>());
    }
}
