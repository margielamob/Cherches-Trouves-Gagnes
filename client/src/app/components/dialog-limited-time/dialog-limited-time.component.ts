import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoGameSnackbarComponent } from '@app/components/no-game-snackbar/no-game-snackbar.component';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-dialog-limited-time',
    templateUrl: './dialog-limited-time.component.html',
    styleUrls: ['./dialog-limited-time.component.scss'],
})
export class DialogLimitedTimeComponent {
    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly communicationSocketService: CommunicationSocketService,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private readonly gameCarouselService: GameCarouselService,
        private readonly snackBar: MatSnackBar,
    ) {}

    onClickSolo() {
        if (this.noGameAvailable()) {
            return;
        }
        this.gameInformationHandlerService.getConstants();
        this.gameInformationHandlerService.isMulti = false;
        this.communicationSocketService.send(SocketEvent.CreateGame, {
            player: this.gameInformationHandlerService.players[0].name,
            mode: this.gameInformationHandlerService.gameMode,
            game: { card: undefined, isMulti: false },
        });
        this.gameInformationHandlerService.handleSocketEvent();
    }

    onClickCoop() {
        if (this.noGameAvailable()) {
            return;
        }
        this.gameInformationHandlerService.getConstants();
        this.gameInformationHandlerService.isMulti = true;
        this.communicationSocketService.send(SocketEvent.CreateGameMulti, {
            player: this.gameInformationHandlerService.players[0].name,
            mode: this.gameInformationHandlerService.gameMode,
            game: { card: undefined, isMulti: true },
        });
        this.gameInformationHandlerService.handleSocketEvent();
    }

    noGameAvailable(): boolean {
        if (this.gameCarouselService.getNumberOfCards() === 0) {
            this.openSnackBar();
        }
        return this.gameCarouselService.getNumberOfCards() === 0;
    }

    openSnackBar() {
        this.snackBar.openFromComponent(NoGameSnackbarComponent, { duration: 3000 });
    }
}
