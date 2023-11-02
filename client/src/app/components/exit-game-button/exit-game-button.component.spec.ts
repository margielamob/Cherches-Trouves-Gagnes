import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';

import { HttpLoaderFactory } from '@app/app.module';
import { LanguageService } from '@app/services/language-service/languag.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ExitGameButtonComponent } from './exit-game-button.component';

describe('ExitGameButtonComponent', () => {
    let component: ExitGameButtonComponent;
    let fixture: ComponentFixture<ExitGameButtonComponent>;
    const model = {};

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExitGameButtonComponent],
            imports: [
                MatDialogModule,
                AppMaterialModule,
                RouterTestingModule,
                HttpClientModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: model }, LanguageService],
        }).compileComponents();

        fixture = TestBed.createComponent(ExitGameButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('dialog should open when exit button is clicked', () => {
        const openDialogSpy = spyOn(component.matDialog, 'open');
        component.onExit();
        expect(openDialogSpy).toHaveBeenCalled();
    });

    it('should send that the player left the waiting room', () => {
        const spySend = spyOn(component['socket'], 'send');
        spyOn(component['gameInfoHandlerService'], 'getId').and.callFake(() => {
            return '1';
        });
        component.onLeaveWaiting();
        expect(spySend).toHaveBeenCalled();

        component['gameInfoHandlerService'].roomId = '1';
        component.onLeaveWaiting();
        expect(spySend).toHaveBeenCalled();
    });
});
