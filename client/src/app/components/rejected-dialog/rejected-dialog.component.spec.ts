import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';

import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RejectedDialogComponent } from './rejected-dialog.component';

describe('RejectedDialogComponent', () => {
    let component: RejectedDialogComponent;
    let fixture: ComponentFixture<RejectedDialogComponent>;

    beforeEach(async () => {
        const model = {
            data: {
                reason: 'reason',
            },
        };
        await TestBed.configureTestingModule({
            declarations: [RejectedDialogComponent],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: model }],
            imports: [
                RouterTestingModule,
                HttpClientModule,
                AppMaterialModule,
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

        fixture = TestBed.createComponent(RejectedDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
