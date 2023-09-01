import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { GameContext } from '@app/classes/game-context/game-context';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { GameStatus } from '@app/enum/game-status';
import { PrivateGameInformation } from '@app/interface/game-info';
import { GameMode } from '@common/game-mode';
import { User } from '@common/user';
import { v4 } from 'uuid';

export class Game {
    players: Map<string, string>;
    timerId: unknown;
    currentIndex: number = 0;
    nbCluesAsked: number = 0;
    isCardDeleted: boolean = false;
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
        return (!this.isMulti && this.players.size === 1) || (this.isMulti && this.players.size === 2);
    }

    setGameCardDeleted() {
        this.isCardDeleted = true;
    }

    addPlayer(player: User) {
        if (this.isGameFull()) {
            return;
        }
        this.players.set(player.id, player.name);
    }

    findPlayer(playerId: string) {
        return this.players.get(playerId);
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
}
