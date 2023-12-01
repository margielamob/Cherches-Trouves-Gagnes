import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateJoinGameDialogueComponent } from '@app/components/create-join-game-dialogue/create-join-game-dialogue.component';
import { LoadingScreenComponent } from '@app/components/loading-screen/loading-screen.component';
import { UserNameInputComponent } from '@app/components/user-name-input/user-name-input.component';
import { CarouselResponse } from '@app/interfaces/carousel-response';
import { UserData } from '@app/interfaces/user';
import { GameCarouselService } from '@app/services/carousel/game-carousel.service';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { MainPageService } from '@app/services/main-page/main-page.service';
import { RouterService } from '@app/services/router-service/router.service';
import { UserService } from '@app/services/user-service/user.service';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import { WaitingRoomInfo } from '@common/waiting-room-info';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    user$: Observable<UserData | undefined>;
    roomId: string;
    isMulti: boolean;
    playersEX: User[] = [];
    cheatMode: boolean;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly mainPageService: MainPageService,
        private readonly matDialog: MatDialog,
        private readonly communicationService: CommunicationService,
        private readonly carouselService: GameCarouselService,
        private readonly router: RouterService,
        private userService: UserService,
        private socket: CommunicationSocketService,
        private chatManager: ChatManagerService,
        private routerService: RouterService,
    ) {}

    ngOnInit(): void {
        this.socket.on(SocketEvent.WaitPlayer, (info: WaitingRoomInfo) => {
            this.roomId = info.roomId;
            this.isMulti = true;
            this.playersEX = info.players;
            this.cheatMode = info.cheatMode;
            this.routerService.navigateTo('waiting');
        });
        this.user$ = this.userService.getCurrentUser();
        this.chatManager.initChat(this.userService.activeUser.displayName);
    }

    onClickPlayClassic(): void {
        this.openCreateJoinGameDialog('classic');
        this.mainPageService.setGameMode(GameMode.Classic);
    }

    onClickPlayLimited(): void {
        this.matDialog.open(LoadingScreenComponent, {
            disableClose: true,
            panelClass: 'custom-dialog-container',
        });
        this.communicationService.getGamesInfoByPage(1).subscribe({
            next: (response: HttpResponse<CarouselResponse>) => {
                if (response && response.body) {
                    this.matDialog.closeAll();
                    this.carouselService.setCarouselInformation(response.body.carouselInfo);
                    this.mainPageService.setGameMode(GameMode.LimitedTime);
                    this.openCreateJoinGameDialog('limited');
                }
            },
            error: () => {
                this.router.redirectToErrorPage();
                this.matDialog.closeAll();
            },
        });
    }

    toggleGameOptions(): void {
        this.onClickPlayClassic();
    }

    navigateTo(path: string): void {
        this.router.navigateTo(path);
        this.toggleGameOptions(); // Hide the options after selection
    }

    openNameDialog(isMulti: boolean = false) {
        this.matDialog.open(UserNameInputComponent, { data: { isMulti } });
    }
    openCreateJoinGameDialog(buttonType: string) {
        this.matDialog.open(CreateJoinGameDialogueComponent, {
            data: { type: buttonType },
        });
    }
}
