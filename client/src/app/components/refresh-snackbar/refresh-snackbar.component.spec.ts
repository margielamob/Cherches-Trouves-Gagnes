import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { AppMaterialModule } from '@app/modules/material.module';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RefreshSnackbarComponent } from './refresh-snackbar.component';

describe('RefreshSnackbarComponent', () => {
    let component: RefreshSnackbarComponent;
    let fixture: ComponentFixture<RefreshSnackbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RefreshSnackbarComponent],
            imports: [
                MatDialogModule,
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
            providers: [
                { provide: MatSnackBarRef, useValue: {} },
                { provide: MAT_SNACK_BAR_DATA, useValue: {} },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(RefreshSnackbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
