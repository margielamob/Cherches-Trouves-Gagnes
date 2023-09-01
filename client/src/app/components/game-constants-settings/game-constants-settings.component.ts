import { Component, OnInit } from '@angular/core';
import { Theme } from '@app/enums/theme';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameTimeConstants } from '@common/game-time-constants';
import { GAME_TIME_CONSTANTS_PARAMS } from '@app/constants/game-constants';

@Component({
    selector: 'app-game-constants-settings',
    templateUrl: './game-constants-settings.component.html',
    styleUrls: ['./game-constants-settings.component.scss'],
})
export class GameConstantsSettingsComponent implements OnInit {
    favoriteTheme: string = Theme.ClassName;
    gameTimeConstants: GameTimeConstants = {
        gameTime: GAME_TIME_CONSTANTS_PARAMS.gameTime,
        penaltyTime: GAME_TIME_CONSTANTS_PARAMS.penaltyTime,
        successTime: GAME_TIME_CONSTANTS_PARAMS.successTime,
    };
    gameTimeConstantsParams = GAME_TIME_CONSTANTS_PARAMS;

    constructor(private readonly communicationService: CommunicationService) {}

    ngOnInit(): void {
        this.getConstants();
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
}
