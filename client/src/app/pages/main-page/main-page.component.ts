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
import { CommunicationService } from '@app/services/communication/communication.service';
import { MainPageService } from '@app/services/main-page/main-page.service';
import { RouterService } from '@app/services/router-service/router.service';
import { UserService } from '@app/services/user-service/user.service';
import { GameMode } from '@common/game-mode';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    user$: Observable<UserData | undefined>;
    showGameOptions: boolean = false;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly mainPageService: MainPageService,
        private readonly matDialog: MatDialog,
        private readonly communicationService: CommunicationService,
        private readonly carouselService: GameCarouselService,
        private readonly router: RouterService,
        private userService: UserService,
        private chatManager: ChatManagerService,
    ) {}

    ngOnInit(): void {
        this.user$ = this.userService.getCurrentUser();
        this.chatManager.initChat();
    }

    onClickPlayClassic(): void {
        this.matDialog.open(CreateJoinGameDialogueComponent);
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
                    this.openCreateJoinGameDialog();
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
    openCreateJoinGameDialog() {
        this.matDialog.open(CreateJoinGameDialogueComponent);
    }
}
