import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameConstantsSettingsComponent } from '@app/components/game-constants-settings/game-constants-settings.component';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { RouterService } from '@app/services/router-service/router.service';
import { SocketEvent } from '@common/socket-event';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly matDialog: MatDialog,
        private readonly gameCarouselService: GameCarouselService,
        private readonly communicationService: CommunicationService,
        private readonly socketService: CommunicationSocketService,
        private readonly router: RouterService,
    ) {}

    hasCards(): boolean {
        return this.gameCarouselService.hasCards();
    }

    refreshAllGames(): void {
        this.communicationService.refreshAllGames().subscribe({
            next: () => {
                this.router.reloadPage('admin');
            },
            error: () => {
                this.router.redirectToErrorPage();
            },
        });
    }

    deleteAllGames(): void {
        this.socketService.send(SocketEvent.GamesDeleted);
        this.communicationService.deleteAllGameCards().subscribe({
            next: () => {
                this.router.reloadPage('admin');
            },
            error: () => {
                this.router.redirectToErrorPage();
            },
        });
    }

    deleteSingleGame(gameId: string): void {
        this.communicationService.deleteGame(gameId).subscribe({
            next: () => {
                this.socketService.send(SocketEvent.GameDeleted, { gameId });
                this.router.navigateTo('admin');
            },
            error: () => {
                this.router.redirectToErrorPage();
            },
        });
    }

    openSettings(): void {
        this.matDialog.open(GameConstantsSettingsComponent);
    }
}
