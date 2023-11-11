import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GameCarouselComponent } from '@app/components/game-carousel/game-carousel.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { environment } from 'src/environments/environment';
import { LoadingScreenComponent } from './loading-screen.component';

describe('LoadingScreenComponent', () => {
    let component: LoadingScreenComponent;
    let fixture: ComponentFixture<LoadingScreenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoadingScreenComponent, GameCarouselComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [AppMaterialModule, BrowserModule, ReactiveFormsModule, AngularFireModule.initializeApp(environment.firebase)],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadingScreenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
