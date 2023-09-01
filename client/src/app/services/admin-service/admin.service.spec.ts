import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminService } from './admin.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { RouterService } from '@app/services/router-service/router.service';

describe('AdminService', () => {
    let service: AdminService;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;
    let spyCarouselService: jasmine.SpyObj<GameCarouselService>;
    let spyRouterService: jasmine.SpyObj<RouterService>;

    beforeEach(() => {
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['deleteAllGameCards', 'refreshAllGames', 'deleteGame']);
        spyCarouselService = jasmine.createSpyObj('GameCarouselService', ['hasCards']);
        spyRouterService = jasmine.createSpyObj('RouterService', ['reloadPage', 'redirectToErrorPage']);
        spyMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule],
            providers: [
                { provide: MatDialog, useValue: spyMatDialog },
                { provide: CommunicationService, useValue: spyCommunicationService },
                { provide: GameCarouselService, useValue: spyCarouselService },
                { provide: RouterService, useValue: spyRouterService },
            ],
        });
        service = TestBed.inject(AdminService);
        spyCommunicationService.deleteAllGameCards.and.returnValue(of());
        spyCommunicationService.refreshAllGames.and.returnValue(of());
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('deleteAllGames should call deleteGames from game communication service', () => {
        spyCommunicationService.deleteAllGameCards.and.returnValue(of(void 0));
        service.deleteAllGames();
        expect(spyCommunicationService.deleteAllGameCards).toHaveBeenCalled();
    });

    it('hasGameCards should call hasCards from game carousel service', () => {
        service.hasCards();
        expect(spyCarouselService.hasCards).toHaveBeenCalled();
    });

    it('openSettings should call call matDialog s method open', () => {
        service.openSettings();
        expect(spyMatDialog.open).toHaveBeenCalled();
    });

    it('should call refreshAllGames from communication service', () => {
        spyCommunicationService.refreshAllGames.and.returnValue(of(void 0));
        service.refreshAllGames();
        expect(spyCommunicationService.refreshAllGames).toHaveBeenCalled();
    });

    it('should redirect to error page on error', () => {
        spyCommunicationService.refreshAllGames.and.returnValue(throwError(() => new Error('error')));
        service.refreshAllGames();
        expect(spyRouterService.redirectToErrorPage).toHaveBeenCalled();
    });

    it('should redirect to error page when there is an error deleting the games', () => {
        spyCommunicationService.deleteAllGameCards.and.returnValue(throwError(() => new Error('error')));
        service.deleteAllGames();
        expect(spyRouterService.redirectToErrorPage).toHaveBeenCalled();
    });

    it('should delete a single game', () => {
        spyCommunicationService.deleteGame.and.returnValue(of(void 0));
        service.deleteSingleGame('id');
        expect(spyCommunicationService.deleteGame).toHaveBeenCalled();
    });

    it('should not delete a single game when there is an error', () => {
        spyCommunicationService.deleteGame.and.returnValue(throwError(() => new Error('error')));
        service.deleteSingleGame('id');
        expect(spyRouterService.redirectToErrorPage).toHaveBeenCalled();
    });
});
