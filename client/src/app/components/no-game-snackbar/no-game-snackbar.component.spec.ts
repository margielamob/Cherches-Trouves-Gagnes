import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { AppMaterialModule } from '@app/modules/material.module';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NoGameSnackbarComponent } from './no-game-snackbar.component';

describe('NoGameSnackbarComponent', () => {
    let component: NoGameSnackbarComponent;
    let fixture: ComponentFixture<NoGameSnackbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NoGameSnackbarComponent],
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
            providers: [{ provide: MatSnackBarRef, useValue: {} }],
        }).compileComponents();

        fixture = TestBed.createComponent(NoGameSnackbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
