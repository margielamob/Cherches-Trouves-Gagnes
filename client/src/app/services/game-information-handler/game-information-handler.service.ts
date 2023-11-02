import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { RouterService } from '@app/services/router-service/router.service';
import { GameId } from '@common/game-id';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';
import { GameTimeConstants } from '@common/game-time-constants';
import { SocketEvent } from '@common/socket-event';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameInformationHandlerService {
    players: { name: string; nbDifferences: number }[] = [];
    roomId: string;
    $playerLeft: Subject<void> = new Subject();
    $differenceFound: Subject<string> = new Subject();
    $newGame: Subject<void> = new Subject();
    gameInformation: PublicGameInformation;
    gameMode: GameMode = GameMode.Classic;
    isReadyToAccept: boolean = true;
    isMulti: boolean = false;
    gameTimeConstants: GameTimeConstants;

    // eslint-disable-next-line max-params
    constructor(
        private readonly routerService: RouterService,
        private readonly socket: CommunicationSocketService,
        private readonly communicationService: CommunicationService,
    ) {}

    propertiesAreUndefined(): boolean {
        return this.gameInformation === undefined || this.players === undefined || this.gameMode === undefined;
    }

    handleSocketEvent() {
        this.socket.once(SocketEvent.Play, (infos: GameId) => {
            if (infos.gameCard) {
                this.setGameInformation(infos.gameCard);
            }
            this.roomId = infos.gameId;
            this.routerService.navigateTo('game');
        });

        this.socket.on(SocketEvent.WaitPlayer, (roomId: string) => {
            this.roomId = roomId;
            this.isMulti = true;
            this.routerService.navigateTo('waiting');
        });
    }

    getConstants(): void {
        this.communicationService.getGameTimeConstants().subscribe((gameTimeConstants) => {
            if (gameTimeConstants && gameTimeConstants.body) {
                this.gameTimeConstants = gameTimeConstants.body;
            }
        });
    }

    handleNotDefined(): void {
        if (this.propertiesAreUndefined()) {
            this.routerService.navigateTo('/');
        }
    }

    resetPlayers() {
        this.players = [];
    }

    setPlayerName(name: string): void {
        this.players.push({ name, nbDifferences: 0 });
    }

    getOriginalBmpId(): string {
        return this.gameInformation.idOriginalBmp;
    }

    getModifiedBmpId(): string {
        return this.gameInformation.idEditedBmp;
    }

    getNbDifferences(playerName: string) {
        return this.players.find((player) => player.name === playerName)?.nbDifferences;
    }

    getNbTotalDifferences(): number {
        return this.gameInformation.nbDifferences;
    }

    setGameInformation(gameInformation: PublicGameInformation): void {
        this.gameInformation = gameInformation;
    }

    setGameMode(gameMode: GameMode): void {
        this.gameMode = gameMode;
    }

    getGameMode(): GameMode {
        this.handleNotDefined();
        return this.gameMode;
    }

    getId(): string {
        this.handleNotDefined();
        return this.gameInformation.id;
    }

    getGameName(): string {
        this.handleNotDefined();
        return this.gameInformation.name;
    }

    getPlayer(): { name: string; nbDifferences: number } {
        this.handleNotDefined();
        return this.players[0];
    }

    getOpponent(): { name: string; nbDifferences: number } {
        return this.players[1];
    }

    isClassic() {
        return this.gameMode === GameMode.Classic;
    }

    isLimitedTime() {
        return this.gameMode === GameMode.LimitedTime;
    }
}
