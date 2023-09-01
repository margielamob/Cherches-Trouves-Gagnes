import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { DialogUploadFormComponent } from '@app/components/dialog-upload-form/dialog-upload-form.component';
import { CanvasType } from '@app/enums/canvas-type';
import { Tool } from '@app/enums/tool';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { PencilService } from '@app/services/pencil-service/pencil.service';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

@Component({
    selector: 'app-common-tool-box',
    templateUrl: './common-tool-box.component.html',
    styleUrls: ['./common-tool-box.component.scss'],
})
export class CommonToolBoxComponent implements OnInit {
    @Input() canvasType: CanvasType;
    tool: typeof Tool = Tool;
    colorButton: { pencil: string; eraser: string };

    /* Michel prefers to have more services uncoupled than tighly bounded components and services*/
    // eslint-disable-next-line max-params
    constructor(public dialog: MatDialog, public pencil: PencilService, public toolService: ToolBoxService, public drawService: DrawService) {
        this.colorButton = { pencil: 'background', eraser: 'primary' };
        this.changeButtonColor(Tool.Pencil);
    }

    ngOnInit(): void {
        this.toolService.addCanvasType(this.canvasType);
    }

    changePencilState(tool: Tool): void {
        this.changeButtonColor(tool);
        this.pencil.state = tool;
    }

    formatLabel(value: number | null) {
        if (value === null) {
            return 0;
        }
        return value.toString() + 'px';
    }

    changePencilColor(color: string): void {
        this.pencil.color = color;
    }

    changePencilWidth(event: MatSliderChange): void {
        if (!event.value) {
            return;
        }
        if (this.pencil.state === Tool.Pencil) {
            this.pencil.setPencilWidth(event.value);
        } else {
            this.pencil.setEraserWidth(event.value);
        }
    }

    changeButtonColor(tool: Tool) {
        this.colorButton = tool === Tool.Eraser ? { pencil: 'primary', eraser: 'accent' } : { pencil: 'accent', eraser: 'primary' };
    }

    openUploadDialog(): void {
        this.dialog.open(DialogUploadFormComponent, { data: { canvas: this.canvasType } });
    }
}
