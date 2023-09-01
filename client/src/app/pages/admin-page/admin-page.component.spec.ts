import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminCommandsComponent } from '@app/components/admin-commands/admin-commands.component';
import { GameCardButtonsComponent } from '@app/components/game-card-buttons/game-card-buttons.component';
import { GameCardComponent } from '@app/components/game-card/game-card.component';
import { GameCarouselComponent } from '@app/components/game-carousel/game-carousel.component';
import { GameScoreComponent } from '@app/components/game-score/game-score.component';
import { LoadingScreenComponent } from '@app/components/loading-screen/loading-screen.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AdminPageComponent,
                AdminCommandsComponent,
                GameCarouselComponent,
                GameCardComponent,
                GameCardButtonsComponent,
                GameScoreComponent,
                PageHeaderComponent,
                LoadingScreenComponent,
            ],
            imports: [AppMaterialModule, RouterTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
            providers: [HttpHandler, HttpClient],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
