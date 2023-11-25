/* eslint-disable max-lines */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-require-imports */
import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { LimitedTimeGame } from '@app/services/limited-time-game-service/limited-time-game.service';
import { TimerService } from '@app/services/timer-service/timer.service';
import { BASE_64_HEADER } from '@common/base64';
import { Coordinate } from '@common/coordinate';
import { DifferenceFound } from '@common/difference';
import { GameMode } from '@common/game-mode';
import { JoinableGameCard } from '@common/joinable-game-card';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import { Server } from 'socket.io';
import { Service } from 'typedi';
import LZString = require('lz-string');
@Service()
export class GameManagerService {
    games: Map<string, Game> = new Map();
    joinObserveClassicGames: Map<string, Game> = new Map();
    joinObserveLimitedGames: Map<string, Game> = new Map();
    observableGames: Map<string, Game> = new Map();
    // eslint-disable-next-line max-params
    constructor(
        private gameInfo: GameInfoService,
        private readonly limitedTimeGame: LimitedTimeGame,
        private difference: DifferenceService,
        private timer: TimerService,
    ) {}

    async createGame(playerInfo: { player: User; isMulti: boolean }, mode: GameMode, gameCardId: string) {
        let gameCard: PrivateGameInformation;
        let game: Game;
        if (mode === GameMode.LimitedTime) {
            const gamesRandomized = await this.limitedTimeGame.generateGames();
            gameCard = gamesRandomized[0];
            game = new Game(playerInfo, { info: gameCard, mode });
            this.limitedTimeGame.gamesShuffled.set(game.identifier, gamesRandomized);
            this.joinObserveLimitedGames.set(game.identifier, game);
        } else {
            gameCard = (await this.gameInfo.getGameInfoById(gameCardId)) as PrivateGameInformation;
            game = new Game(playerInfo, { info: gameCard, mode });
            this.joinObserveClassicGames.set(game.identifier, game);
        }
        await this.timer.setTimerConstant(game.identifier);
        this.games.set(game.identifier, game);
        this.difference.setGameDifferences(game.identifier);
        this.difference.setPlayerDifferences(game.identifier, playerInfo.player.id);
        return game.identifier;
    }

    getLimitedJoinableGame(roomId: string): JoinableGameCard | undefined {
        const game = this.joinObserveLimitedGames.get(roomId);
        if (!game) {
            return;
        }
        const thumbnail = BASE_64_HEADER + LZString.decompressFromUTF16(game.information.thumbnail);
        const nbDifferences = game.information.differences.length;

        const players = this.getPlayers(roomId) || [];
        const gameCardInfo = {
            id: game.information.id,
            name: game.information.name,
            thumbnail: BASE_64_HEADER + LZString.decompressFromUTF16(game.information.thumbnail),
            nbDifferences: game.information.differences.length,
            idEditedBmp: game.information.idEditedBmp,
            idOriginalBmp: game.information.idOriginalBmp,
            multiplayerScore: game.information.multiplayerScore,
            soloScore: game.information.soloScore,
            isMulti: false,
        };
        return { players, nbDifferences, thumbnail, roomId, gameInformation: gameCardInfo };
    }
    getJoinableGames(): JoinableGameCard[] {
        return Array.from(this.joinObserveClassicGames.keys())
            .map((roomId) => this.getJoinableGame(roomId))
            .filter((game) => game !== undefined) as JoinableGameCard[];
    }
    getJoinableLimitedGames(): JoinableGameCard[] {
        return Array.from(this.joinObserveLimitedGames.keys())
            .map((roomId) => this.getLimitedJoinableGame(roomId))
            .filter((game) => game !== undefined) as JoinableGameCard[];
    }

    getJoinableGame(roomId: string): JoinableGameCard | undefined {
        const game = this.joinObserveClassicGames.get(roomId);
        if (!game) {
            return;
        }
        const thumbnail = BASE_64_HEADER + LZString.decompressFromUTF16(game.information.thumbnail);
        const nbDifferences = game.information.differences.length;
        const players = this.getPlayers(roomId) || [];
        const gameCardInfo = {
            id: game.information.id,
            name: game.information.name,
            thumbnail: BASE_64_HEADER + LZString.decompressFromUTF16(game.information.thumbnail),
            nbDifferences: game.information.differences.length,
            idEditedBmp: game.information.idEditedBmp,
            idOriginalBmp: game.information.idOriginalBmp,
            multiplayerScore: game.information.multiplayerScore,
            soloScore: game.information.soloScore,
            isMulti: false,
        };
        return { players, nbDifferences, thumbnail, roomId, gameInformation: gameCardInfo };
    }

    getGameInfo(gameId: string) {
        return this.findGame(gameId)?.information;
    }

    setNextGame(gameId: string) {
        const game = this.findGame(gameId);
        if (game) {
            game.nextIndex();
            const gamesToPlay = this.limitedTimeGame.getGamesToPlay(gameId);
            if (!gamesToPlay) {
                return;
            } else if (gamesToPlay.length <= game.currentIndex) {
                game.setEndgame();
                return;
            } else {
                game.setInfo(gamesToPlay[game.currentIndex]);
            }
        }
    }

    setTimer(gameId: string, initialTime: number) {
        return this.isGameFound(gameId) ? this.timer.setTimer(this.findGame(gameId) as Game, initialTime) : null;
    }

    sendTimer(sio: Server, gameId: string, playerId: string) {
        const game = this.findGame(gameId);
        if (!game) {
            return;
        }
        if (this.timer.isStartedTimer(gameId)) {
            return;
        }
        this.timer.started(gameId);
        game.timerId = setInterval(() => {
            const remainingTime = this.timer.calculateTime(game); // Get the remaining time

            if (remainingTime <= 0 || game.isGameOver()) {
                sio.sockets.to(gameId).emit(SocketEvent.Win);
                this.leaveGame(playerId, gameId);
                this.deleteTimer(gameId);
            } else {
                sio.sockets.to(gameId).emit(SocketEvent.Clock, remainingTime);
            }
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        }, 1000);
    }

    deleteTimer(gameId: string) {
        const game = this.findGame(gameId);
        if (!game) {
            return;
        }
        clearInterval(game.timerId as NodeJS.Timer);
    }

    increaseTimer(gameId: string, bonusTime: number) {
        const game = this.findGame(gameId);
        if (game) {
            let timer = this.timer.initialTime.get(game.identifier);
            if (timer === undefined || timer === null) {
                return;
            }
            timer += bonusTime;
            this.timer.initialTime.set(game.identifier, timer);
        }
    }

    gameCardDeletedHandle(gameCardId: string) {
        this.games.forEach((game) => {
            if (game.information.id === gameCardId) {
                game.setGameCardDeleted();
            }
        });
    }

    allGameCardsDeleted() {
        this.games.forEach((game) => {
            game.setGameCardDeleted();
        });
    }

    isGameCardDeleted(gameId: string) {
        return this.isGameFound(gameId) ? (this.findGame(gameId) as Game).isCardDeleted : null;
    }

    getTime(gameId: string) {
        const game = this.findGame(gameId);
        return game ? this.timer.seconds(game) : null;
    }

    isCheatMode(gameId: string) {
        return (this.findGame(gameId) as Game).isCheatMode;
    }
    setCheatMode(gameId: string, cheatMode: boolean) {
        const game = this.findGame(gameId);
        if (game) {
            game.isCheatMode = cheatMode;
        }
    }
    isClassic(gameId: string) {
        return this.isGameFound(gameId) ? (this.findGame(gameId) as Game).isClassic() : null;
    }

    isLimitedTime(gameId: string) {
        return this.isGameFound(gameId) ? (this.findGame(gameId) as Game).isLimitedTime() : null;
    }

    isDifference(gameId: string, playerId: string, coord: Coordinate) {
        const game = this.findGame(gameId);
        return !game ? null : this.difference.isDifferenceFound(playerId, coord, game);
    }

    isGameFound(gameId: string) {
        return this.findGame(gameId) !== undefined;
    }

    isGameOver(gameId: string) {
        return this.isGameFound(gameId) ? (this.findGame(gameId) as Game).isGameOver() : null;
    }

    nbDifferencesLeft(gameId: string) {
        const game = this.findGame(gameId);
        return this.isGameFound(gameId) ? this.difference.nbDifferencesLeft((game as Game).information.differences, gameId) : null;
    }

    resetDifferencesFound(gameId: string) {
        this.difference.resetDifferencesFound(gameId);
    }

    isGameAlreadyFull(gameId: string) {
        const game = this.findGame(gameId);
        return !game || game.isGameFull();
    }

    addPlayer(player: User, gameId: string) {
        const game = this.findGame(gameId);
        if (!game) {
            return;
        }
        this.difference.setPlayerDifferences(game.identifier, player.id);
        game.addPlayer(player);
    }

    getPlayers(gameId: string) {
        const game = this.findGame(gameId);
        return !game ? undefined : Array.from(game.players.values());
    }

    getNbDifferenceNotFound(gameId: string) {
        const game = this.findGame(gameId);
        return !game ? undefined : this.difference.getAllDifferencesNotFound(game.information.differences, gameId);
    }

    // hasSameName(roomId: string, playersName: string) {
    //     const game = this.findGame(roomId);
    //     return !game ? false : Array.from(game.players.values()).includes(playersName);
    // }

    isGameMultiplayer(gameId: string) {
        const game = this.findGame(gameId);
        return game?.multi;
    }

    leaveGame(playerId: string, gameId: string) {
        const game = this.findGame(gameId);
        game?.leaveGame(playerId);
        this.deleteTimer(gameId);
    }

    discardGame(gameId: string) {
        this.games.delete(gameId);
    }

    getNbDifferencesFound(differenceCoords: Coordinate[], gameId: string, isPlayerFoundDifference?: boolean): DifferenceFound {
        return isPlayerFoundDifference !== undefined
            ? {
                  coords: differenceCoords,
                  nbDifferencesLeft: this.nbDifferencesLeft(gameId) as number,
                  isPlayerFoundDifference,
              }
            : {
                  coords: differenceCoords,
                  nbDifferencesLeft: this.nbDifferencesLeft(gameId) as number,
              };
    }

    increaseNbClueAsked(gameId: string) {
        const game = this.findGame(gameId);
        if (game) {
            game.nbCluesAsked++;
        }
    }

    getNbClues(gameId: string) {
        return this.findGame(gameId)?.nbCluesAsked;
    }

    removePlayer(roomId: string, playerId: string) {
        const game = this.findGame(roomId);
        if (game) {
            game.removePlayer(playerId);
        }
    }

    isGameCreator(roomId: string, playerId: string) {
        const game = this.findGame(roomId);
        return game?.isGameCreator(playerId);
    }

    findPlayer(gameId: string, playerId: string) {
        return this.findGame(gameId)?.findPlayer(playerId);
    }

    addObservableGame(gameId: string) {
        const game = this.games.get(gameId);
        if (game) {
            this.observableGames.set(gameId, game);
        }
    }
    getObservableGames() {
        return Array.from(this.observableGames.keys());
    }
    addDifferenceFound(gameId: string, difference: Coordinate[]) {
        const game = this.games.get(gameId);
        if (game) {
            game.addDifferenceFound(difference);
        }
    }
    removeJoinableGame(gameId: string) {
        this.joinObserveClassicGames.delete(gameId);
    }
    removeGame(gameId: string) {
        this.games.delete(gameId);
    }

    findGame(gameId: string): Game | undefined {
        return this.games.get(gameId);
    }
    getLimitedTimeGamePlayers(gameId: string) {
        const game = this.joinObserveLimitedGames.get(gameId);
        return !game ? undefined : Array.from(game.players.values());
    }

    getGame(gameId: string) {
        return this.games.get(gameId);
    }
    updateObservableGameState(gameId: string) {
        const game = this.observableGames.get(gameId);
        if (game) {
            return game.getDifferenceFound();
        }
        return;
    }
}
