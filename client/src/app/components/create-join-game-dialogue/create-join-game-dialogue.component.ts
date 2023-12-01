import { HttpResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogSetUpGameComponent } from '@app/components/dialog-set-up-game/dialog-set-up-game/dialog-set-up-game.component';
import { CarouselResponse } from '@app/interfaces/carousel-response';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { JoinableGameService } from '@app/services/joinable-game/joinable-game.service';
import { MainPageService } from '@app/services/main-page/main-page.service';
import { ThemeService } from '@app/services/theme-service/theme.service';
import { UserService } from '@app/services/user-service/user.service';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-create-join-game-dialogue',
    templateUrl: './create-join-game-dialogue.component.html',
    styleUrls: ['./create-join-game-dialogue.component.scss'],
})
export class CreateJoinGameDialogueComponent {
    isLimited: boolean = false;
    theme: string;
    // eslint-disable-next-line max-params
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { type: string },
        private matDialog: MatDialog,
        private readonly mainPageService: MainPageService,
        private router: Router,
        private communicationService: CommunicationService,
        private readonly carouselService: GameCarouselService,
        private gameInformationHandlerService: GameInformationHandlerService,
        private communicationSocketService: CommunicationSocketService,
        private themeService: ThemeService,
        private joinableGameService: JoinableGameService,
        private userService: UserService,
    ) {
        this.isLimited = data.type === 'limited';
        this.theme = this.themeService.getAppTheme();
    }

    onCreateClick(): void {
        if (this.isLimited) {
            const dialogRef = this.matDialog.open(DialogSetUpGameComponent, {
                data: { type: 'limited' },
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.communicationService.getGamesInfoByPage(1).subscribe({
                        next: (response: HttpResponse<CarouselResponse>) => {
                            if (response && response.body) {
                                this.matDialog.closeAll();
                                this.carouselService.setCarouselInformation(response.body.carouselInfo);
                                this.mainPageService.setGameMode(GameMode.LimitedTime);
                            }
                        },
                        error: () => {
                            this.matDialog.closeAll();
                        },
                    });
                    this.gameInformationHandlerService.waitingRoomLimited();
                    this.gameInformationHandlerService.isCreator = true;
                    this.gameInformationHandlerService.getConstants();
                    this.gameInformationHandlerService.isMulti = true;
                    this.gameInformationHandlerService.gameMode = GameMode.LimitedTime;
                    this.communicationSocketService.send(SocketEvent.CreateLimitedGame, {
                        player: {
                            name: this.userService.activeUser.displayName,
                            avatar: this.userService.activeUser.photoURL,
                            id: this.userService.activeUser.uid,
                        },
                        card: { id: undefined, timer: result.duration, bonus: result.bonus },
                        isMulti: true,
                    });

                    this.gameInformationHandlerService.setPlayerName(this.userService.activeUser.displayName);
                    this.gameInformationHandlerService.handleSocketEvent();
                }
            });
        } else {
            this.router.navigate(['/select']);
        }
    }

    onJoinClick(): void {
        if (this.isLimited) {
            this.joinableGameService.isClassic = false;
            this.router.navigate(['/join-game']);
        } else {
            this.joinableGameService.isClassic = true;
            this.router.navigate(['/join-game']);
        }
    }
}
