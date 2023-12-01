import { Component, Input, OnInit } from '@angular/core';
import { GameCard } from '@app/interfaces/game-card';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { GamesWaitingInfo } from '@common/games-waiting-info';
import { JoinableGameCard } from '@common/joinable-game-card';
import { Score } from '@common/score';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';

@Component({
    selector: 'app-game-card',
    templateUrl: './game-card.component.html',
    styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
    @Input() gameCard: GameCard;
    @Input() isJoining: boolean = false;
    @Input() joinableGameCard: JoinableGameCard;
    isObservable: boolean = false;
    observers: User[] = [];
    imageSrc: string;
    constructor(
        private readonly communicationSocket: CommunicationSocketService,
        private readonly timeFormatter: TimeFormatterService,
        private readonly gameInfoService: GameInformationHandlerService,
    ) {}

    ngOnInit() {
        this.setImagesSrc();
        this.listenForOpenLobbies();
    }

    listenForOpenLobbies(): void {
        this.communicationSocket.send(SocketEvent.GetGamesWaiting, { mode: this.gameInfoService.gameMode });

        this.communicationSocket.on(SocketEvent.GetGamesWaiting, (games: GamesWaitingInfo) => {
            if (this.gameInfoService.gameMode === games.mode) {
                for (const info of games.gamesWaiting) {
                    if (this.gameCard.gameInformation.id === info) {
                        this.gameCard.isMulti = true;
                    }
                }
            }
        });
    }

    setImagesSrc(): void {
        if (this.isJoining) {
            this.imageSrc = this.joinableGameCard.thumbnail;
            return;
        }
        this.imageSrc = this.gameCard.gameInformation.thumbnail;
    }

    formatScoreTime(scoreTime: number): string {
        return this.timeFormatter.formatTime(scoreTime);
    }

    getNbDifferences() {
        return this.gameCard.gameInformation.nbDifferences;
    }
    getGameName(): string {
        return this.gameCard.gameInformation.name;
    }

    isAdminCard(): boolean {
        return this.gameCard.isAdminCard;
    }

    getMultiplayerScores(): Score[] {
        return this.gameCard.gameInformation.multiplayerScore;
    }
    hasMultiplayerScores(): boolean {
        return this.gameCard.gameInformation.multiplayerScore.length > 0;
    }
}
