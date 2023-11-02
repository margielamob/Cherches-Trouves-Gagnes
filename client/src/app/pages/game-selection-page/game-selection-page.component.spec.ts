import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpLoaderFactory } from '@app/app.module';
import { LoadingScreenComponent } from '@app/components/loading-screen/loading-screen.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { GameSelectionPageComponent } from './game-selection-page.component';

describe('GameSelectionPageComponent', () => {
    let component: GameSelectionPageComponent;
    let fixture: ComponentFixture<GameSelectionPageComponent>;
    let spyGameCarouselService: jasmine.SpyObj<GameCarouselService>;

    beforeEach(async () => {
        spyGameCarouselService = jasmine.createSpyObj('GameCarouselService', ['setCardMode', 'getCards', 'getNumberOfCards', 'hasCards']);
        await TestBed.configureTestingModule({
            declarations: [GameSelectionPageComponent, LoadingScreenComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
            providers: [
                {
                    provide: GameCarouselService,
                    useValue: spyGameCarouselService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameSelectionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    it('getNumberOfGames should call get number of cards from gameCarouselService', () => {
        component.getNumberOfGames();
        expect(spyGameCarouselService.getNumberOfCards).toHaveBeenCalled();
    });

    it('hasGames should call hasCards from gameCarouselService', () => {
        component.hasGames();
        expect(spyGameCarouselService.hasCards).toHaveBeenCalled();
    });
});
