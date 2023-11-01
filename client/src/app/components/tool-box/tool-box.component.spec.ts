import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasType } from '@app/enums/canvas-type';
import { AppMaterialModule } from '@app/modules/material.module';
import { ToolBoxService } from '@app/services/tool-box/tool-box.service';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToolBoxComponent } from './tool-box.component';

describe('ToolBoxComponent', () => {
    let component: ToolBoxComponent;
    let fixture: ComponentFixture<ToolBoxComponent>;
    let toolBoxServiceSpyObj: jasmine.SpyObj<ToolBoxService>;
    let dialogSpyObj: jasmine.SpyObj<MatDialog>;
    beforeEach(async () => {
        dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
        toolBoxServiceSpyObj = jasmine.createSpyObj('ToolBoxService', ['addCanvasType'], { $pencil: new Map() });
        await TestBed.configureTestingModule({
            declarations: [ToolBoxComponent],
            providers: [
                { provide: ToolBoxService, useValue: toolBoxServiceSpyObj },
                { provide: MatDialog, useValue: dialogSpyObj },
            ],
            imports: [
                AppMaterialModule,
                BrowserAnimationsModule,
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

        fixture = TestBed.createComponent(ToolBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.canvasType = CanvasType.Left;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open a dialog to upload an image', () => {
        component.openUploadDialog();
        expect(dialogSpyObj.open).toHaveBeenCalled();
    });
});
