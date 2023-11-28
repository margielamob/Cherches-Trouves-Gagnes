/* eslint-disable @typescript-eslint/no-magic-numbers */
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
export class CommonToolBoxComponent implements OnInit, AfterViewInit {
    @ViewChild('colorSelector') colorSelector: ElementRef<HTMLInputElement>;

    @Input() canvasType: CanvasType;
    tool: typeof Tool = Tool;
    colorButton: { pencil: string; eraser: string };
    isRectangleSelected: boolean = false;
    isEllipseSelected: boolean = false;
    isPencilSelected: boolean = true;
    isEraserSelected: boolean = false;
    isPipette: boolean = false;
    isPaintBucket: boolean = false;

    /* Michel prefers to have more services uncoupled than tighly bounded components and services*/
    // eslint-disable-next-line max-params
    constructor(public dialog: MatDialog, public pencil: PencilService, public toolService: ToolBoxService, public drawService: DrawService) {
        this.colorButton = { pencil: 'background', eraser: 'primary' };
        this.changeButtonColor(Tool.Pencil);
    }

    ngOnInit(): void {
        this.toolService.addCanvasType(this.canvasType);
    }
    ngAfterViewInit(): void {
        this.drawService.inputColorChanged$.subscribe((color) => {
            this.colorSelector.nativeElement.value = this.rgbaToHex(color);
        });
    }

    rgbaToHex(rgba: string): string {
        const matches = rgba.match(/(\d+)/g);

        if (!matches || matches.length < 3) {
            return '#000000';
        }

        const hexArray = matches.slice(0, 3).map((num) => {
            const hex = parseInt(num, 10).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        });

        return '#' + hexArray.join('');
    }

    changePencilState(tool: Tool): void {
        this.changeButtonColor(tool);
        this.pencil.state = tool;
        this.isPencilSelected = tool === Tool.Pencil;
        this.isEraserSelected = tool === Tool.Eraser;
        this.isRectangleSelected = tool === Tool.Rectangle;
        this.isEllipseSelected = tool === Tool.Ellipse;
        this.isPipette = tool === Tool.Pipette;
        this.isPaintBucket = tool === Tool.Bucket;
        this.drawService.isBucket = this.isPaintBucket;
        this.drawService.isPipette = this.isPipette;
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
