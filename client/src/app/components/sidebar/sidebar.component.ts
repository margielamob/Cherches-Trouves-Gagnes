import { Component } from '@angular/core';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { GameMode } from '@common/game-mode';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    gameMode: GameMode;
    gameName: string;
    penaltyTime: number;
    differenceTime: number;

    constructor(private readonly gameInformationHandlerService: GameInformationHandlerService) {
        this.setInfos();
    }

    setInfos() {
        this.gameMode = this.gameInformationHandlerService.getGameMode();
        this.gameName = this.gameInformationHandlerService.getGameName();
        this.penaltyTime = this.gameInformationHandlerService.gameTimeConstants.penaltyTime;
        this.differenceTime = this.gameInformationHandlerService.gameTimeConstants.successTime;
        this.gameInformationHandlerService.$newGame.subscribe(() => {
            this.gameMode = this.gameInformationHandlerService.getGameMode();
            this.gameName = this.gameInformationHandlerService.getGameName();
        });
    }

    isSoloMode() {
        return !this.gameInformationHandlerService.isMulti;
    }

    isLimitedTimeMode() {
        return this.gameInformationHandlerService.isLimitedTime();
    }

    isMulti() {
        return this.gameInformationHandlerService.isMulti;
    }
}
