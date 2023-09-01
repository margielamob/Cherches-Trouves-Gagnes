import { Component } from '@angular/core';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-differences-area',
    templateUrl: './differences-area.component.html',
    styleUrls: ['./differences-area.component.scss'],
})
export class DifferencesAreaComponent {
    players: { name: string; nbDifference: string }[];
    private mainPlayer: { name: string; nbDifferences: number };
    private opponentPlayer: { name: string; nbDifferences: number };
    constructor(private readonly gameInformationHandlerService: GameInformationHandlerService) {
        this.setPlayersInfo();
    }

    setPlayersInfo() {
        this.mainPlayer = this.gameInformationHandlerService.getPlayer();
        this.opponentPlayer = this.gameInformationHandlerService.getOpponent();
        if (!this.isLimited()) {
            this.setPlayerInfosClassic();
            return;
        }
        this.setPlayerLimitedTime();
    }

    setPlayerInfosClassic() {
        this.players = !this.opponentPlayer
            ? [{ name: this.mainPlayer.name, nbDifference: this.setNbDifferencesFound(this.mainPlayer.name) as string }]
            : [
                  { name: this.mainPlayer.name, nbDifference: this.setNbDifferencesFound(this.mainPlayer.name) as string },
                  { name: this.opponentPlayer.name, nbDifference: this.setNbDifferencesFound(this.opponentPlayer.name) as string },
              ];

        this.gameInformationHandlerService.$differenceFound.subscribe((playerName: string) => {
            const notFindIndex = -1;
            if (this.getPlayerIndex(playerName) === notFindIndex) {
                return;
            }
            this.players[this.getPlayerIndex(playerName)].nbDifference = this.setNbDifferencesFound(playerName);
        });
    }

    setPlayerLimitedTime() {
        this.players = !this.opponentPlayer
            ? [{ name: this.mainPlayer.name, nbDifference: this.setNbDifferencesFoundLimited() as string }]
            : [
                  {
                      name: this.mainPlayer.name + ' & ' + this.opponentPlayer.name,
                      nbDifference: this.setNbDifferencesFoundLimited() as string,
                  },
              ];
        this.gameInformationHandlerService.$playerLeft.subscribe(() => {
            this.players = [{ name: this.mainPlayer.name, nbDifference: this.setNbDifferencesFoundLimited() as string }];
        });

        this.gameInformationHandlerService.$differenceFound.subscribe(() => {
            this.players[0].nbDifference = this.setNbDifferencesFoundLimited();
        });
    }

    isLimited(): boolean {
        return this.gameInformationHandlerService.isLimitedTime();
    }

    getPlayerIndex(playerName: string) {
        return this.players.findIndex((player: { name: string; nbDifference: string }) => player.name === playerName);
    }

    setNbDifferencesFound(playerName: string): string {
        const nbPlayerDifference = this.gameInformationHandlerService.getNbDifferences(playerName);
        if (nbPlayerDifference === undefined) {
            return '';
        }
        if (this.gameInformationHandlerService.isClassic()) {
            return nbPlayerDifference.toString() + ' / ' + this.gameInformationHandlerService.getNbTotalDifferences().toString();
        } else {
            return nbPlayerDifference.toString();
        }
    }

    setNbDifferencesFoundLimited() {
        const nbPlayerDifference = this.gameInformationHandlerService.getNbDifferences(this.mainPlayer.name) as number;

        if (this.opponentPlayer) {
            const nbOpponentDifference = this.gameInformationHandlerService.getNbDifferences(this.opponentPlayer.name) as number;
            return (nbPlayerDifference + nbOpponentDifference).toString();
        }

        return nbPlayerDifference.toString();
    }
}
