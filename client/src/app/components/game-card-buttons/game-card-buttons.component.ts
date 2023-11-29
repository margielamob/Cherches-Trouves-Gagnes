import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '@app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogSetUpGameComponent } from '@app/components/dialog-set-up-game/dialog-set-up-game/dialog-set-up-game.component';
import { UserNameInputComponent } from '@app/components/user-name-input/user-name-input.component';
import { GameCard } from '@app/interfaces/game-card';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { RouterService } from '@app/services/router-service/router.service';
import { GameMode } from '@common/game-mode';
import { JoinableGameCard } from '@common/joinable-game-card';

@Component({
    selector: 'app-game-card-buttons',
    templateUrl: './game-card-buttons.component.html',
    styleUrls: ['./game-card-buttons.component.scss'],
})
export class GameCardButtonsComponent {
    @Input() gameCard: GameCard;
    @Input() joinableGameCard: JoinableGameCard;
    isObservable: boolean = false;

    constructor(
        private readonly gameInfoHandlerService: GameInformationHandlerService,
        private readonly router: RouterService,
        private readonly matDialog: MatDialog,
        private readonly communicationService: CommunicationService,
    ) {}

    isMultiplayer(): boolean {
        return this.gameCard.isMulti;
    }

    onClickDeleteGame(game: GameCard): void {
        this.matDialog.open(ConfirmDeleteDialogComponent, { data: { gameId: game.gameInformation.id, singleGameDelete: true } });
    }

    onClickPlayGame(): void {
        this.gameInfoHandlerService.setGameInformation(this.gameCard.gameInformation);
        this.gameInfoHandlerService.isMulti = false;
        this.openNameDialog();
    }

    onClickCreateJoinGame(): void {
        const dialogRef = this.matDialog.open(DialogSetUpGameComponent, {
            data: { type: 'classic' },
            width: '300px',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.gameInfoHandlerService.setGameInformation(this.gameCard.gameInformation);
                this.gameInfoHandlerService.isMulti = true;
                this.gameInfoHandlerService.cheatMode = result.cheatMode;
                this.gameInfoHandlerService.timer = result.duration;
                this.gameInfoHandlerService.isCreator = true;
                this.gameInfoHandlerService.waitingRoom();
            }
        });
    }

    onClickJoinGame(): void {
        this.gameInfoHandlerService.setGameInformation(this.joinableGameCard.gameInformation);
        this.gameInfoHandlerService.isMulti = true;
        this.gameInfoHandlerService.joinGame(this.joinableGameCard.roomId);
    }

    onClickObserveGame(): void {
        this.gameInfoHandlerService.setGameInformation(this.joinableGameCard.gameInformation);
        this.gameInfoHandlerService.isMulti = true;
        this.gameInfoHandlerService.isObserver = true;
        this.gameInfoHandlerService.gameMode = this.joinableGameCard.gameMode as GameMode;
        this.gameInfoHandlerService.observeGame(this.joinableGameCard.roomId);
    }

    onClickRefreshGame(): void {
        this.communicationService.refreshSingleGame(this.gameCard.gameInformation.id).subscribe({
            next: () => {
                this.router.reloadPage('admin');
            },
            error: () => {
                this.router.redirectToErrorPage();
            },
        });
    }

    private openNameDialog(isMulti: boolean = false): void {
        this.matDialog.open(UserNameInputComponent, { data: { isMulti } });
    }
}
