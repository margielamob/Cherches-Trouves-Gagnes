import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CarouselResponse } from '@app/interfaces/carousel-response';
import { AppMaterialModule } from '@app/modules/material.module';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { MainPageService } from '@app/services/main-page/main-page.service';
import { RouterService } from '@app/services/router-service/router.service';
import { GameMode } from '@common/game-mode';
import { of, throwError } from 'rxjs';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let spyMainPageService: jasmine.SpyObj<MainPageService>;
    let spyGameInfosHandlerService: jasmine.SpyObj<GameInformationHandlerService>;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;
    let spyRouter: jasmine.SpyObj<RouterService>;

    beforeEach(async () => {
        spyMainPageService = jasmine.createSpyObj('GamePageService', ['setGameMode']);
        spyGameInfosHandlerService = jasmine.createSpyObj('GameInformationHandlerService', ['setGameMode', 'getGameName', 'getGameMode']);
        spyMatDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open', 'closeAll']);
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['getAllGameInfos', 'getGamesInfoByPage']);
        spyRouter = jasmine.createSpyObj('RouterService', ['redirectToErrorPage']);

        await TestBed.configureTestingModule({
            declarations: [MainPageComponent],
            imports: [AppMaterialModule, NoopAnimationsModule, RouterTestingModule, BrowserAnimationsModule, ReactiveFormsModule, HttpClientModule],
            providers: [
                { provide: MatDialog, useValue: spyMatDialog },
                {
                    provide: MainPageService,
                    useValue: spyMainPageService,
                },
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInfosHandlerService,
                },
                {
                    provide: CommunicationService,
                    useValue: spyCommunicationService,
                },
                {
                    provide: RouterService,
                    useValue: spyRouter,
                },
            ],
        }).compileComponents();
        spyCommunicationService.getGamesInfoByPage.and.callFake(() => {
            return of({ body: { carouselInfo: {}, games: [{}] } } as HttpResponse<CarouselResponse>);
        });
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'Jeu de différences'", () => {
        expect(component.title).toEqual('Jeu de différences');
    });

    it('should set GameMode to Classic when Classic button is clicked', () => {
        component.onClickPlayClassic();
        expect(spyMainPageService.setGameMode).toHaveBeenCalledWith(GameMode.Classic);
    });

    it('should set GameMode to Limited when Limited button is clicked', () => {
        component.onClickPlayLimited();
        expect(spyMainPageService.setGameMode).toHaveBeenCalledWith(GameMode.LimitedTime);
    });

    it('should redirect to error page if there is an error', () => {
        spyCommunicationService.getGamesInfoByPage.and.returnValue(throwError(() => new Error('Error')));
        component.onClickPlayLimited();
        expect(spyRouter.redirectToErrorPage).toHaveBeenCalled();
    });
});
