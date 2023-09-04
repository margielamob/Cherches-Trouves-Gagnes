import { HttpResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoadingScreenComponent } from "@app/components/loading-screen/loading-screen.component";
import { UserNameInputComponent } from "@app/components/user-name-input/user-name-input.component";
import { CarouselResponse } from "@app/interfaces/carousel-response";
import { GameCarouselService } from "@app/services/carousel/game-carousel.service";
import { CommunicationService } from "@app/services/communication/communication.service";
import { MainPageService } from "@app/services/main-page/main-page.service";
import { RouterService } from "@app/services/router-service/router.service";
import { GameMode } from "@common/game-mode";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"],
})
export class MainPageComponent {
  readonly title: string = "Jeu de différences";

  // eslint-disable-next-line max-params -- absolutely need all the imported services
  constructor(
    private readonly mainPageService: MainPageService,
    private readonly matDialog: MatDialog,
    private readonly communicationService: CommunicationService,
    private readonly carouselService: GameCarouselService,
    private readonly router: RouterService
  ) {}

  onClickPlayClassic(): void {
    this.mainPageService.setGameMode(GameMode.Classic);
  }

  onClickPlayLimited(): void {
    this.matDialog.open(LoadingScreenComponent, {
      disableClose: true,
      panelClass: "custom-dialog-container",
    });
    this.communicationService.getGamesInfoByPage(1).subscribe({
      next: (response: HttpResponse<CarouselResponse>) => {
        if (response && response.body) {
          this.matDialog.closeAll();
          this.carouselService.setCarouselInformation(
            response.body.carouselInfo
          );
          this.mainPageService.setGameMode(GameMode.LimitedTime);
          this.openNameDialog();
        }
      },
      error: () => {
        this.router.redirectToErrorPage();
        this.matDialog.closeAll();
      },
    });
  }

  openNameDialog(isMulti: boolean = false) {
    this.matDialog.open(UserNameInputComponent, { data: { isMulti } });
  }
}
