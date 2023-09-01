import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUploadFormComponent } from '@app/components/dialog-upload-form/dialog-upload-form.component';
import { CanvasType } from '@app/enums/canvas-type';
import { DrawService } from '@app/services/draw-service/draw-service.service';

@Component({
    selector: 'app-tool-box',
    templateUrl: './tool-box.component.html',
    styleUrls: ['./tool-box.component.scss'],
})
export class ToolBoxComponent {
    @Input() canvasType: CanvasType;
    constructor(public dialog: MatDialog, public drawService: DrawService) {}

    openUploadDialog(): void {
        this.dialog.open(DialogUploadFormComponent, { data: { canvas: this.canvasType } });
    }
}
