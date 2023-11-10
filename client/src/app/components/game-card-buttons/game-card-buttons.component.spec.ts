import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpLoaderFactory } from '@app/app.module';
import { gameCard1 } from '@app/constants/game-card-constant.spec';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { RouterService } from '@app/services/router-service/router.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { GameCardButtonsComponent } from './game-card-buttons.component';

describe('GameCardButtonsComponent', () => {
    let component: GameCardButtonsComponent;
    let fixture: ComponentFixture<GameCardButtonsComponent>;
    let spyRouterService: jasmine.SpyObj<RouterService>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;
    let spyGameInfoHandlerService: jasmine.SpyObj<GameInformationHandlerService>;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        spyRouterService = jasmine.createSpyObj('RouterService', ['reloadPage', 'redirectToErrorPage']);
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['deleteGame', 'refreshSingleGame']);
        spyGameInfoHandlerService = jasmine.createSpyObj('GameInformationHandlerService', ['setGameInformation']);
        spyMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            imports: [
                AppMaterialModule,
                RouterTestingModule,
                NoopAnimationsModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            declarations: [GameCardButtonsComponent],
            providers: [
                HttpHandler,
                HttpClient,
                {
                    provide: RouterService,
                    useValue: spyRouterService,
                },
                {
                    provide: CommunicationService,
                    useValue: spyCommunicationService,
                },
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInfoHandlerService,
                },
                {
                    provide: MatDialog,
                    useValue: spyMatDialog,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameCardButtonsComponent);
        component = fixture.componentInstance;
        component.gameCard = gameCard1;
        spyCommunicationService.deleteGame.and.returnValue(of(void 0));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onClickPlayGame should call the open name dialog method', () => {
        component.onClickPlayGame();
        expect(spyGameInfoHandlerService.setGameInformation).toHaveBeenCalled();
        expect(spyMatDialog.open).toHaveBeenCalled();
    });

    it('should return is multi attribute', () => {
        expect(component.isMultiplayer()).toBeTrue();
    });
    it('should delete game on click', () => {
        component.onClickDeleteGame(gameCard1);
        expect(spyMatDialog.open).toHaveBeenCalled();
    });

    it('should refresh the scores on click', () => {
        spyCommunicationService.refreshSingleGame.and.returnValue(of(void 0));
        component.onClickRefreshGame();
        expect(spyRouterService.reloadPage).toHaveBeenCalled();
    });

    it('should redirect to error page when on click reset fails', () => {
        spyCommunicationService.refreshSingleGame.and.returnValue(throwError(() => new Error('error')));
        component.onClickRefreshGame();
        expect(spyRouterService.redirectToErrorPage).toHaveBeenCalled();
    });
});
