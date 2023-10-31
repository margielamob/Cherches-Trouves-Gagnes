import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { LimitedTimeGame } from '@app/services/limited-time-game-service/limited-time-game.service';
import { TimerService } from '@app/services/timer-service/timer.service';
import { Coordinate } from '@common/coordinate';
import { DifferenceFound } from '@common/difference';
import { GameMode } from '@common/game-mode';
import { JoinableGameCard } from '@common/joinable-game-card';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import { Server } from 'socket.io';
import { Service } from 'typedi';
@Service()
export class GameManagerService {
    games: Map<string, Game> = new Map();
    joinableGames: Map<string, Game> = new Map();
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
        } else {
            gameCard = (await this.gameInfo.getGameInfoById(gameCardId)) as PrivateGameInformation;
            game = new Game(playerInfo, { info: gameCard, mode });
        }
        await this.timer.setTimerConstant(game.identifier);
        this.games.set(game.identifier, game);
        this.joinableGames.set(game.identifier, game);
        this.difference.setGameDifferences(game.identifier);
        this.difference.setPlayerDifferences(game.identifier, playerInfo.player.id);
        return game.identifier;
    }

    getJoinableGames() {
        return Array.from(this.joinableGames.values());
    }

    getJoinableGame(roomId: string): JoinableGameCard | undefined {
        const game = this.joinableGames.get(roomId);
        if (!game) {
            return;
        }
        const thumbnail = game.information.thumbnail;
        const nbDifferences = game.information.differences.length;
        const players = this.getPlayers(roomId) || [];
        return { players, nbDifferences, thumbnail, roomId };
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

    setTimer(gameId: string) {
        return this.isGameFound(gameId) ? this.timer.setTimer(this.findGame(gameId) as Game) : null;
    }

    sendTimer(sio: Server, gameId: string, playerId: string) {
        const game = this.findGame(gameId);
        if (!game) {
            return;
        }

        game.timerId = setInterval(() => {
            if (game.gameMode === GameMode.LimitedTime && this.isGameOver(gameId)) {
                // high scores to handle here
                sio.sockets.to(gameId).emit(SocketEvent.Win);
                this.leaveGame(playerId, gameId);
                this.deleteTimer(gameId);
            } else {
                sio.sockets.to(gameId).emit(SocketEvent.Clock, this.getTime(gameId));
            }
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- one second is 1000 ms
        }, 1000);
    }

    deleteTimer(gameId: string) {
        const game = this.findGame(gameId);
        if (!game) {
            return;
        }
        clearInterval(game.timerId as NodeJS.Timer);
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
        if (game && game.hasNoPlayer()) {
            this.games.delete(gameId);
        }
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

    findPlayer(gameId: string, playerId: string) {
        return this.findGame(gameId)?.findPlayer(playerId);
    }

    private findGame(gameId: string): Game | undefined {
        return this.games.get(gameId);
    }
}
