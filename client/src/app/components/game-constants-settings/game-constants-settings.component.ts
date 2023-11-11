import { Component, OnDestroy, OnInit } from '@angular/core';
import { GAME_TIME_CONSTANTS_PARAMS } from '@app/constants/game-constants';
import { CommunicationService } from '@app/services/communication/communication.service';
import { ThemeService } from '@app/services/theme-service/theme.service';
import { UserService } from '@app/services/user-service/user.service';
import { GameTimeConstants } from '@common/game-time-constants';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-game-constants-settings',
    templateUrl: './game-constants-settings.component.html',
    styleUrls: ['./game-constants-settings.component.scss'],
})
export class GameConstantsSettingsComponent implements OnInit, OnDestroy {
    gameTimeConstants: GameTimeConstants = {
        gameTime: GAME_TIME_CONSTANTS_PARAMS.gameTime,
        penaltyTime: GAME_TIME_CONSTANTS_PARAMS.penaltyTime,
        successTime: GAME_TIME_CONSTANTS_PARAMS.successTime,
    };
    gameTimeConstantsParams = GAME_TIME_CONSTANTS_PARAMS;
    userThemeSubscription: Subscription;
    currentTheme: string;

    constructor(private readonly communicationService: CommunicationService, public userService: UserService, private themeServie: ThemeService) {}

    ngOnInit(): void {
        this.getConstants();
        this.currentTheme = this.themeServie.getAppTheme();
    }

    onClickRestoreDefaultValues(): void {
        this.gameTimeConstants = {
            gameTime: GAME_TIME_CONSTANTS_PARAMS.gameTime,
            penaltyTime: GAME_TIME_CONSTANTS_PARAMS.penaltyTime,
            successTime: GAME_TIME_CONSTANTS_PARAMS.successTime,
        };
    }

    setGameTimeConstants(): void {
        this.communicationService.setGameTimeConstants(this.gameTimeConstants).subscribe();
    }

    getConstants(): void {
        this.communicationService.getGameTimeConstants().subscribe((gameTimeConstants) => {
            if (gameTimeConstants && gameTimeConstants.body) {
                this.gameTimeConstants = gameTimeConstants.body;
            }
        });
    }

    isDefaultValues(): boolean {
        return (
            this.gameTimeConstants.gameTime === GAME_TIME_CONSTANTS_PARAMS.gameTime &&
            this.gameTimeConstants.penaltyTime === GAME_TIME_CONSTANTS_PARAMS.penaltyTime &&
            this.gameTimeConstants.successTime === GAME_TIME_CONSTANTS_PARAMS.successTime
        );
    }

    ngOnDestroy(): void {
        if (this.userThemeSubscription) {
            this.userThemeSubscription.unsubscribe();
        }
    }
}
