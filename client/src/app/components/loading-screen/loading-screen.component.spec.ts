import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCarouselComponent } from '@app/components/game-carousel/game-carousel.component';
import { LoadingScreenComponent } from './loading-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoadingScreenComponent', () => {
    let component: LoadingScreenComponent;
    let fixture: ComponentFixture<LoadingScreenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadingScreenComponent, GameCarouselComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [AppMaterialModule, BrowserModule, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
