import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { RouterService } from '@app/services/router-service/router.service';
import { UserService } from '@app/services/user-service/user.service';
import { Coordinate } from '@common/coordinate';
import { GameId } from '@common/game-id';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';
import { GameTimeConstants } from '@common/game-time-constants';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import { UserAuth } from '@common/userAuth';
import { WaitingRoomInfo } from '@common/waiting-room-info';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class GameInformationHandlerService {
    playersEX: User[] = [];
    players: { name: string; nbDifferences: number }[] = [];
    roomId: string;
    player: UserAuth = { displayName: '', avatar: '' };
    $playerLeft: Subject<void> = new Subject();
    $differenceFound: Subject<string> = new Subject();
    $newGame: Subject<void> = new Subject();
    gameInformation: PublicGameInformation;
    gameMode: GameMode;
    isReadyToAccept: boolean = true;
    isMulti: boolean = false;
    gameTimeConstants: GameTimeConstants;
    cheatMode: boolean = false;
    timer: number = 0;
    isCreator: boolean = false;
    differencesToClear: Coordinate[][];
    differencesObserved: Coordinate[][];
    endedTime: number;
    isGameDone: boolean = false;
    isObserver: boolean = false;
    startTimer: number;
    emailTimer: number;
    // eslint-disable-next-line max-params
    constructor(
        private readonly routerService: RouterService,
        private readonly socket: CommunicationSocketService,
        private readonly communicationService: CommunicationService,
        private readonly userService: UserService,
    ) {}

    propertiesAreUndefined(): boolean {
        return this.gameInformation === undefined || this.players === undefined || this.gameMode === undefined;
    }

    handleSocketEvent() {
        this.socket.once(SocketEvent.Play, (infos: GameId) => {
            if (infos.gameCard) {
                this.setGameInformation(infos.gameCard);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.setDifferencesToClear(infos.data!.coords);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                if ((this.isObserver && infos.data!.players) || this.isLimitedTime()) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    infos.data!.players!.forEach((player: User) => this.setPlayerName(player.name, player.nbDifferenceFound));
                }
            }
            this.roomId = infos.gameId;
            this.routerService.navigateTo('game');
        });

        this.socket.on(SocketEvent.StartClock, (payload: { timer: number }) => {
            this.startTimer = payload.timer;
        });

        this.socket.on(SocketEvent.StartLimitedClock, (payload: { timer: number }) => {
            this.startTimer = payload.timer;
        });

        this.socket.on(SocketEvent.WaitPlayer, (info: WaitingRoomInfo) => {
            this.roomId = info.roomId;
            this.isMulti = true;
            this.playersEX = info.players;
            this.cheatMode = info.cheatMode;
            this.routerService.navigateTo('waiting');
        });
    }
    setDifferencesToClear(differences: Coordinate[][]) {
        this.differencesToClear = differences;
    }

    getPlayersEX() {
        return this.playersEX;
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

    setPlayerName(name: string, nbDifferenceFound?: number): void {
        this.players.push({ name, nbDifferences: nbDifferenceFound ? nbDifferenceFound : 0 });
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

    getOpponent(): { name: string; nbDifferences: number }[] {
        return this.players.filter((player) => player.name !== this.player.displayName);
    }

    getOpponents(): { name: string; nbDifferences: number }[] {
        return this.players.filter((player) => player.name !== this.player.displayName);
    }

    isClassic() {
        return this.gameMode === GameMode.Classic;
    }

    isLimitedTime() {
        return this.gameMode === GameMode.LimitedTime;
    }

    waitingRoom() {
        this.player.displayName = this.userService.activeUser.displayName;
        this.player.avatar = this.userService.activeUser.photoURL;
        this.socket.send(SocketEvent.CreateClassicGame, {
            player: { name: this.player.displayName, avatar: this.player.avatar, socketId: this.socket.socket.id },
            card: { id: this.getId(), cheatMode: this.cheatMode, timer: this.timer },
        });
        this.setPlayerName(this.player.displayName);
        this.handleSocketEvent();
    }

    waitingRoomLimited() {
        this.player.displayName = this.userService.activeUser.displayName;
        this.player.avatar = this.userService.activeUser.photoURL;
        this.setPlayerName(this.player.displayName);
        this.handleSocketEvent();
    }
    joinGame(roomId: string) {
        this.player.displayName = this.userService.activeUser.displayName;
        this.player.avatar = this.userService.activeUser.photoURL;
        this.socket.send(SocketEvent.JoinClassicGame, {
            player: { name: this.player.displayName, avatar: this.player.avatar, socketId: this.socket.socket.id },
            roomId,
        });
        this.setPlayerName(this.player.displayName);
        this.handleSocketEvent();
    }

    observeGame(roomId: string) {
        this.player.displayName = this.userService.activeUser.displayName;
        this.player.avatar = this.userService.activeUser.photoURL;
        this.socket.send(SocketEvent.ObserveGame, {
            player: { name: this.player.displayName, avatar: this.player.avatar, socketId: this.socket.socket.id },
            roomId,
        });
        this.setPlayerName(this.player.displayName);
        this.handleSocketEvent();
    }
    resetGameVariables(): void {
        this.playersEX = [];
        this.players = [];
        this.roomId = '';
        this.player = { displayName: '', avatar: '' };
        this.$playerLeft = new Subject<void>();
        this.$differenceFound = new Subject<string>();
        this.$newGame = new Subject<void>();
        this.gameMode = GameMode.Classic;
        this.isReadyToAccept = true;
        this.isMulti = false;
        this.cheatMode = false;
        this.timer = 0;
        this.isObserver = false;
        this.isCreator = false;
    }
}
