import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { Tool } from '@app/enums/tool';
import { AppMaterialModule } from '@app/modules/material.module';
import { DrawService } from '@app/services/draw-service/draw-service.service';

import { CommonToolBoxComponent } from './common-tool-box.component';

describe('CommonToolBoxComponent', () => {
    let component: CommonToolBoxComponent;
    let spyDialog: jasmine.SpyObj<MatDialog>;
    let spyDrawService: jasmine.SpyObj<DrawService>;
    let fixture: ComponentFixture<CommonToolBoxComponent>;

    beforeEach(async () => {
        spyDialog = jasmine.createSpyObj('MatDialog', ['open']);
        spyDrawService = jasmine.createSpyObj('DrawService', ['resetBackground']);
        await TestBed.configureTestingModule({
            imports: [MatDialogModule, AppMaterialModule],
            providers: [
                { provide: MatDialog, useValue: spyDialog },
                { provide: DrawService, useValue: spyDrawService },
            ],
            declarations: [CommonToolBoxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CommonToolBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open upload dialog', () => {
        component.openUploadDialog();
        expect(spyDialog.open).toHaveBeenCalled();
    });

    it('changeButtonColor should be called when calling changePencilState', () => {
        const spy = spyOn(component, 'changeButtonColor');
        const tool: Tool = Tool.Eraser;
        component.changePencilState(tool);
        expect(spy).toHaveBeenCalled();
    });

    it('changePencilState should modify the current state of the pencil', () => {
        const tool: Tool = Tool.Eraser;
        component.changePencilState(tool);
        expect(component.pencil.state).toEqual(tool);
    });

    it('changePencilState should modify the current state of the pencil', () => {
        const tool: Tool = Tool.Eraser;
        component.changePencilState(tool);
        expect(component.pencil.state).toEqual(tool);
    });

    it('formatLabel should return null if the parameter is invalid', () => {
        expect(component.formatLabel(null)).toEqual(0);
    });

    it('formatLabel should return a string if the parameter is valid', () => {
        expect(component.formatLabel(1)).toEqual('1px');
    });

    it('changePencilColor should change the color of the pencil', () => {
        component.changePencilColor('orange');
        expect(component.pencil.color).toEqual('orange');
    });

    it('changePencilWidth should return if nothing is pass as parameter', () => {
        expect(component.changePencilWidth({} as MatSliderChange)).toEqual(undefined);
    });

    it('changePencilWidth should change the width is changed', () => {
        component.pencil.setEraserWidth(0);
        component.pencil.setPencilWidth(1);
        component.pencil.state = Tool.Pencil;
        component.changePencilWidth({ value: 2 } as MatSliderChange);
        expect(component.pencil.width).toEqual(2);
        component.pencil.state = Tool.Eraser;
        expect(component.pencil.width).toEqual(0);
    });

    it('changePencilWidth should change the width is changed', () => {
        component.pencil.setEraserWidth(0);
        component.pencil.setPencilWidth(1);
        component.pencil.state = Tool.Eraser;
        component.changePencilWidth({ value: 2 } as MatSliderChange);
        expect(component.pencil.width).toEqual(2);
        component.pencil.state = Tool.Pencil;
        expect(component.pencil.width).toEqual(1);
    });
});
