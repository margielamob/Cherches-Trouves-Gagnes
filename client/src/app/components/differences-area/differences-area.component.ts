import { Component } from '@angular/core';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-differences-area',
    templateUrl: './differences-area.component.html',
    styleUrls: ['./differences-area.component.scss'],
})
export class DifferencesAreaComponent {
    players: { name: string; nbDifference: string }[];
    mainPlayer: { name: string; nbDifferences: number };
    private opponentPlayers: { name: string; nbDifferences: number }[] = [];
    constructor(private readonly gameInformationHandlerService: GameInformationHandlerService) {
        this.setPlayersInfo();
    }

    removeDuplicate(): void {
        const uniqueSet = new Set();

        const newPlayers = this.players.filter((player) => {
            const name = player.name;
            if (!uniqueSet.has(name)) {
                uniqueSet.add(name);
                return true;
            }
            return false;
        });

        this.players = newPlayers;
    }

    setPlayersInfo() {
        if (!this.gameInformationHandlerService.isObserver) {
            this.mainPlayer = this.gameInformationHandlerService.getPlayer();
        }
        this.opponentPlayers = this.gameInformationHandlerService.getOpponents();
        this.setPlayerInfosClassic();
    }

    setPlayerInfosClassic() {
        const opponents = this.opponentPlayers.map((opponent) => ({
            name: opponent.name,
            nbDifference: this.setNbDifferencesFound(opponent.name) as string,
        }));

        this.players = [...opponents];

        this.removeDuplicate();

        this.gameInformationHandlerService.$differenceFound.subscribe((playerName: string) => {
            const notFindIndex = -1;
            if (this.getPlayerIndex(playerName) === notFindIndex) {
                return;
            }

            this.players[this.getPlayerIndex(playerName)].nbDifference = this.setNbDifferencesFound(playerName);
        });
    }

    // setPlayerLimitedTime() {
    //     const opponents = this.opponentPlayers.map((opponent) => ({
    //         name: opponent.name,
    //         nbDifference: this.setNbDifferencesFound(opponent.name) as string,
    //     }));

    //     this.players = [...opponents];

    //     this.removeDuplicate();

    //     this.gameInformationHandlerService.$differenceFound.subscribe((playerName: string) => {
    //         const notFindIndex = -1;
    //         if (this.getPlayerIndex(playerName) === notFindIndex) {
    //             return;
    //         }

    //         this.players[this.getPlayerIndex(playerName)].nbDifference = this.setNbDifferencesFound(playerName);
    //     });
    // }

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

    // setNbDifferencesFoundLimited() {
    //     const nbPlayerDifference = this.gameInformationHandlerService.getNbDifferences(this.mainPlayer.name) as number;

    //     if (this.opponentPlayers) {
    //         const nbOpponentDifference = this.gameInformationHandlerService.getNbDifferences(this.opponentPlayers.name) as number;
    //         return (nbPlayerDifference + nbOpponentDifference).toString();
    //     }

    //     return nbPlayerDifference.toString();
    // }
}
