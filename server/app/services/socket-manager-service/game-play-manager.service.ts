/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrivateGameInformation } from '@app/interface/game-info';
import { CluesService } from '@app/services/clues-service/clues.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { EventMessageService } from '@app/services/message-event-service/message-event.service';
import { ScoresHandlerService } from '@app/services/scores-handler-service/scores-handler.service';
import { BASE_64_HEADER } from '@common/base64';
import { Coordinate } from '@common/coordinate';
import { PublicGameInformation } from '@common/game-information';
import { ScoreType } from '@common/score-type';
import { SocketEvent } from '@common/socket-event';
import * as LZString from 'lz-string';
import * as io from 'socket.io';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { ChatSocketManager } from './chat.service';
import { SocketServer } from './server-socket-manager.service';

@Service()
export class GamePlayManager {
    // eslint-disable-next-line max-params
    constructor(
        private serverSocket: SocketServer,
        private gameManager: GameManagerService,
        private eventMessageService: EventMessageService,
        private readonly scoresHandlerService: ScoresHandlerService,
        private cluesService: CluesService,
        private chatManager: ChatSocketManager,
    ) {}

    private get sio(): io.Server {
        return this.serverSocket.sio;
    }

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.FetchDifferences, (gameId: string) => {
            socket.emit(SocketEvent.FetchDifferences, this.gameManager.getNbDifferenceNotFound(gameId));
        });

        socket.on(SocketEvent.ResetGameInfosReplay, (gameId) => {
            this.gameManager.resetDifferencesFound(gameId);
        });

        socket.on(SocketEvent.Clue, (gameId: string) => {
            this.gameManager.increaseNbClueAsked(gameId);
            const pixelResult = this.cluesService.findRandomPixel(gameId);
            switch (this.gameManager.getNbClues(gameId)) {
                case 1:
                    this.sio.to(gameId).emit(SocketEvent.Clue, { clue: this.cluesService.firstCluePosition(pixelResult), nbClues: 1 });
                    break;
                case 2:
                    this.sio.to(gameId).emit(SocketEvent.Clue, { clue: this.cluesService.secondCluePosition(pixelResult), nbClues: 2 });
                    break;
                case 3:
                    this.sio.to(gameId).emit(SocketEvent.Clue, { clue: this.cluesService.thirdCluePosition(pixelResult), nbClues: 3 });
            }
            this.sio.to(gameId).emit(SocketEvent.EventMessage, this.eventMessageService.usingClueMessage());
        });

        // eslint-disable-next-line max-params
        socket.on(SocketEvent.Difference, (differenceCoord: Coordinate, gameId: string, playerName: string, isOriginal: boolean) => {
            if (!this.gameManager.isGameFound(gameId)) {
                socket.emit(SocketEvent.Error);
                return;
            }
            const differences = this.gameManager.isDifference(gameId, socket.id, differenceCoord);
            if (!differences) {
                socket.emit(SocketEvent.DifferenceNotFound, { isOriginal, differenceCoord });
                this.sio
                    .to(gameId)
                    .emit(
                        SocketEvent.EventMessage,
                        this.eventMessageService.differenceNotFoundMessage(
                            this.gameManager.findPlayer(gameId, socket.id)?.name as string,
                            this.gameManager.isGameMultiplayer(gameId),
                        ),
                    );
                return;
            }

            this.sio
                .to(gameId)
                .emit(
                    SocketEvent.EventMessage,
                    this.eventMessageService.differenceFoundMessage(
                        this.gameManager.findPlayer(gameId, socket.id)?.name as string,
                        this.gameManager.isGameMultiplayer(gameId),
                    ),
                );
            // socket.broadcast.to(gameId).emit(SocketEvent.DifferenceFound, this.gameManager.getNbDifferencesFound(differences, gameId, true));
            this.sio.to(gameId).emit(SocketEvent.DifferenceFound, {
                data: this.gameManager.getNbDifferencesFound(differences, gameId),
                playerName,
                differenceCoord,
            });
            this.gameManager.addDifferenceFound(gameId, differences);

            if (this.gameManager.isGameOver(gameId)) {
                this.handleEndGame(gameId, socket);
            }
            this.gameManager.addDifferenceFoundToPlayer(gameId, socket.id);
            if (this.gameManager.isLimitedTime(gameId)) {
                this.gameManager.increaseTimer(gameId, this.gameManager.getGame(gameId)!.bonusTime);
                this.sio.to(gameId).emit(SocketEvent.TimerBonus, {
                    bonus: this.gameManager.getGame(gameId)!.bonusTime,
                });
                this.gameManager.setNextGame(gameId);
                const nextGameCard = this.gameManager.getGameInfo(gameId);
                let gameCardInfo: PublicGameInformation;
                if (nextGameCard) {
                    gameCardInfo = {
                        id: nextGameCard.id,
                        name: nextGameCard.name,
                        thumbnail: BASE_64_HEADER + LZString.decompressFromUTF16(nextGameCard.thumbnail),
                        nbDifferences: nextGameCard.differences.length,
                        idEditedBmp: nextGameCard.idEditedBmp,
                        idOriginalBmp: nextGameCard.idOriginalBmp,
                        multiplayerScore: nextGameCard.multiplayerScore,
                        soloScore: nextGameCard.soloScore,
                        isMulti: false,
                    };
                    const newDifferences = this.removeRandomDifference(this.gameManager.getGameInfo(gameId)!.differences);
                    this.gameManager.getGame(gameId)!.differencesToClear.coords = newDifferences.newDifferences;
                    this.gameManager.getGameInfo(gameId)!.differences = [
                        this.gameManager.getGameInfo(gameId)!.differences[newDifferences.randomIndex],
                    ];
                    this.sio.to(gameId).emit(SocketEvent.NewGameBoard, {
                        gameInfo: gameCardInfo,
                        coords: this.gameManager.getGame(gameId)!.differencesToClear.coords,
                    });
                }
            }
        });

        socket.on(SocketEvent.ObserveGame, (player: { name: string; avatar: string }, gameId: string) => {
            socket.join(gameId);
            const pastPlayerDiffs = this.gameManager.updateObservableGameState(gameId);
            const gameCard = this.gameManager.getGameInfo(gameId);
            this.gameManager.addObserver(gameId, { name: player.name, id: socket.id, avatar: player.avatar });
            this.chatManager.joinGameChat(gameId, { name: player.name, id: socket.id }, socket);
            let gameCardInfo: PublicGameInformation;
            if (gameCard) {
                gameCardInfo = {
                    id: gameCard.id,
                    name: gameCard.name,
                    thumbnail: BASE_64_HEADER + LZString.decompressFromUTF16(gameCard.thumbnail),
                    nbDifferences: gameCard.differences.length,
                    idEditedBmp: gameCard.idEditedBmp,
                    idOriginalBmp: gameCard.idOriginalBmp,
                    multiplayerScore: gameCard.multiplayerScore,
                    soloScore: gameCard.soloScore,
                    isMulti: false,
                };

                const players = this.gameManager.getPlayers(gameId) || [];
                this.gameManager.sendTimer(this.sio, gameId, socket.id);
                if (this.gameManager.isLimitedTime(gameId)) {
                    socket.emit(SocketEvent.Play, {
                        gameId,
                        gameCard: gameCardInfo,
                        data: {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            coords: this.gameManager.getGame(gameId)!.differencesToClear.coords,
                            nbDifferencesLeft: 1,
                            players,
                        },
                    });
                } else {
                    socket.emit(SocketEvent.Play, {
                        gameId,
                        gameCard: gameCardInfo,
                        data: {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            coords: pastPlayerDiffs,
                            nbDifferencesLeft: 1,
                            players,
                        },
                    });
                }
            }
        });
    }

    removeRandomDifference(differences: any[][]): { newDifferences: Coordinate[][]; randomIndex: number } {
        if (differences.length === 0) return { newDifferences: [], randomIndex: 0 };
        const randomIndex = Math.floor(Math.random() * differences.length);
        const newDifferences = differences.filter((_, index) => index !== randomIndex);
        return { newDifferences, randomIndex };
    }
    endGame(roomId: string) {
        this.gameManager.removeGame(roomId);
    }

    private handleEndGame(gameId: string, socket: Socket): void {
        const time = this.gameManager.getTime(gameId) as number;
        const playerName = this.gameManager.findPlayer(gameId, socket.id)?.name as string;
        const gameInfo = this.gameManager.getGameInfo(gameId);
        const isMulti = this.gameManager.isGameMultiplayer(gameId) as boolean;
        this.gameManager.findGame(gameId)?.incrementPlayers();

        if (!this.gameManager.isGameCardDeleted(gameId)) {
            this.scoresHandlerService
                .verifyScore((gameInfo as PrivateGameInformation).id as string, { playerName, time, type: ScoreType.Player }, isMulti)
                .then((index) => {
                    this.gameManager.leaveGame(socket.id, gameId);

                    if (isMulti) {
                        socket.broadcast.to(gameId).emit(SocketEvent.Lose, playerName);
                    }

                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- index is -1 when not added to the list
                    if (index !== -1) {
                        socket.emit(SocketEvent.Win, playerName);
                        this.sio.sockets.emit(
                            SocketEvent.EventMessage,
                            this.eventMessageService.sendNewHighScoreMessage({
                                record: { index, time },
                                playerName,
                                gameName: (gameInfo as PrivateGameInformation).name as string,
                                isMulti,
                            }),
                        );
                        return;
                    }

                    socket.emit(SocketEvent.Win, playerName);
                    return;
                });
        } else {
            this.gameManager.leaveGame(socket.id, gameId);

            if (isMulti) {
                socket.broadcast.to(gameId).emit(SocketEvent.Lose, playerName);
            }

            socket.emit(SocketEvent.Win, playerName);
            return;
        }
    }
}
