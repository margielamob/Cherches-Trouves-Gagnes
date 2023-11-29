/* eslint-disable @typescript-eslint/no-magic-numbers */
import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { GameStatus } from '@app/enum/game-status';
import { PrivateGameInformation } from '@app/interface/game-info';
import { Coordinate } from '@common/coordinate';
import { GameMode } from '@common/game-mode';
import { User } from '@common/user';
import { v4 } from 'uuid';

export class Game {
    players: Map<string, User>;
    timerId: unknown;
    currentIndex: number = 0;
    nbCluesAsked: number = 0;
    isCardDeleted: boolean = false;
    isCheatMode: boolean = false;
    gameCreator: User = {} as User;
    differencesToClear: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        coords: Coordinate[][];
        nbDifferencesLeft: 1;
    } = { coords: [], nbDifferencesLeft: 1 };
    differencesAlreadyFound: Coordinate[][] = [];
    bonusTime: number = 0;
    isObservable: boolean = false;
    wasLastPlayer: boolean = false;
    observers: User[] = [];
    private numberOfPlayers: number = 0;
    private numberOfPlayersLeftArena: number = 0;
    private id: string;
    private mode: GameMode;
    private isMulti: boolean;
    private info: PrivateGameInformation;
    private context: GameContext;

    constructor(player: { player: User; isMulti: boolean }, game: { info: PrivateGameInformation; mode: GameMode }) {
        this.info = game.info;
        this.mode = game.mode;
        this.players = new Map();
        this.isMulti = player.isMulti;
        this.context = new GameContext(game.mode as GameMode, new InitGameState(), player.isMulti);
        this.id = v4();
        this.context.next();
        this.gameCreator = player.player;
        this.addPlayer(player.player);
    }

    get identifier() {
        return this.id;
    }

    get gameMode() {
        return this.mode;
    }

    get multi() {
        return this.isMulti;
    }

    get information() {
        return this.info;
    }

    get status(): GameStatus {
        return this.context.gameState();
    }

    makeObservable() {
        this.isObservable = true;
    }

    incrementPlayers() {
        this.numberOfPlayers++;
    }

    incrementLeftArena() {
        this.numberOfPlayersLeftArena++;
    }

    isArenaEmpty() {
        return this.numberOfPlayers === this.numberOfPlayersLeftArena;
    }

    setEndgame() {
        this.context.end();
    }

    setInfo(gameInfo: PrivateGameInformation) {
        this.info = gameInfo;
    }

    nextIndex() {
        this.currentIndex++;
    }

    next() {
        this.context.next();
    }

    isClassic() {
        return this.gameMode === GameMode.Classic;
    }

    isLimitedTime() {
        return this.gameMode === GameMode.LimitedTime;
    }

    isGameInitialize() {
        return this.status === GameStatus.InitGame || this.status === GameStatus.InitTimer;
    }

    isGameOver() {
        return this.context.gameState() === GameStatus.EndGame;
    }

    isGameFull() {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return this.isMulti && this.players.size === 4;
    }

    hasOnePlayer() {
        return this.players.size === 1;
    }

    setGameCardDeleted() {
        this.isCardDeleted = true;
    }

    addPlayer(player: User) {
        if (this.isGameFull()) {
            return;
        }
        this.players.set(player.id, player);
    }

    isLastPlayer() {
        return this.players.size === 4;
    }
    findPlayer(playerId: string) {
        return this.players.get(playerId);
    }

    isGameCreator(playerId: string) {
        return this.gameCreator.id === playerId;
    }
    removePlayer(playerId: string) {
        this.players.delete(playerId);
    }
    getPlayers() {
        return this.players;
    }

    leaveGame(playerId: string) {
        const player = this.findPlayer(playerId);
        if (!player) {
            return;
        }
        this.players.delete(playerId);
        this.context.transitionTo(new EndGameState());
    }

    hasNoPlayer() {
        return this.players.size === 0;
    }
    addDifferenceFound(difference: Coordinate[]) {
        this.differencesAlreadyFound.push(difference);
    }
    addDifferenceFoundToPlayer(playerId: string) {
        const player = this.findPlayer(playerId);
        if (!player) {
            return;
        }
        if (player.nbDifferenceFound === undefined) {
            player.nbDifferenceFound = 1;
        } else {
            player.nbDifferenceFound++;
        }
    }
    getDifferenceFound() {
        return this.differencesAlreadyFound;
    }
    addObserver(observer: User) {
        this.observers.push(observer);
    }
    removeObserver(playerId: string) {
        this.observers = this.observers.filter((observer) => observer.id !== playerId);
    }
    isObserver(playerId: string) {
        return this.observers.some((observer) => observer.id === playerId);
    }
}
