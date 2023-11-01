import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { GameConstantFieldComponent } from './game-constant-field.component';

describe('GameConstantFieldComponent', () => {
    let component: GameConstantFieldComponent;
    let fixture: ComponentFixture<GameConstantFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameConstantFieldComponent],
            imports: [
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

        fixture = TestBed.createComponent(GameConstantFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle plus and raise value', () => {
        component.value = 0;
        component.max = 10;
        component.step = 1;
        component.togglePlus();
        const expectedValue = 1;
        expect(component.value).toEqual(expectedValue);
    });

    it('should toggle plus and lower value', () => {
        component.value = 10;
        component.min = 0;
        component.step = 1;
        component.toggleMinus();
        const expectedValue = 9;
        expect(component.value).toEqual(expectedValue);
    });

    it('should verify if the value is the min', () => {
        component.value = 0;
        component.min = 0;
        expect(component.isAtMin()).toBeTruthy();
    });

    it('should verify if the value is the max', () => {
        component.value = 10;
        component.max = 10;
        expect(component.isAtMax()).toBeTruthy();
    });
});
