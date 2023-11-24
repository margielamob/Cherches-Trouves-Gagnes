import { Bmp } from '@app/classes/bmp/bmp';
import { PrivateGameInformation } from '@app/interface/game-info';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { GameTimeConstantService } from '@app/services/game-time-constant/game-time-constants.service';
import { GameValidation } from '@app/services/game-validation-service/game-validation.service';
import { SocketManagerService } from '@app/services/socket-manager-service/socket-manager-service.service';
import { BASE_64_HEADER } from '@common/base64';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as LZString from 'lz-string';
import { Service } from 'typedi';

@Service()
export class GameController {
    router: Router;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private gameInfo: GameInfoService,
        private gameValidation: GameValidation,
        private readonly socketManager: SocketManagerService,
        private readonly gameTimeConstantService: GameTimeConstantService,
    ) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.patch('/scores/:id/reset', (req: Request, res: Response) => {
            const id = req.params.id;
            this.gameInfo
                .resetHighScores(id)
                .then((value) => {
                    if (value === null) {
                        res.status(StatusCodes.SERVICE_UNAVAILABLE).send();
                        return;
                    }
                    res.sendStatus(StatusCodes.OK);
                })
                .catch(() => {
                    res.sendStatus(StatusCodes.NOT_FOUND);
                });
        });

        this.router.patch('/scores/reset', (req: Request, res: Response) => {
            this.gameInfo
                .resetAllHighScores()
                .then((value) => {
                    if (value === null) {
                        res.status(StatusCodes.SERVICE_UNAVAILABLE).send();
                        return;
                    }
                    res.sendStatus(StatusCodes.OK);
                })
                .catch(() => {
                    res.sendStatus(StatusCodes.BAD_REQUEST);
                });
        });

        this.router.delete('/cards/:id', (req: Request, res: Response) => {
            const isGameDeleted = this.gameInfo.deleteGameInfoById(req.params.id.toString());
            isGameDeleted
                .then((isDeleted) => {
                    if (isDeleted === null) {
                        res.status(StatusCodes.SERVICE_UNAVAILABLE).send();
                        return;
                    }
                    const status = isDeleted ? StatusCodes.ACCEPTED : StatusCodes.NOT_FOUND;
                    res.status(status).send();
                    this.socketManager.refreshGames();
                })
                .catch(() => {
                    res.status(StatusCodes.BAD_REQUEST).send();
                });
        });

        this.router.delete('/cards', (req: Request, res: Response) => {
            this.gameInfo
                .deleteAllGamesInfo()
                .then((value) => {
                    if (value === null) {
                        res.status(StatusCodes.SERVICE_UNAVAILABLE).send();
                        return;
                    }
                    res.status(StatusCodes.ACCEPTED).send();
                    this.socketManager.refreshGames();
                })
                .catch(() => {
                    res.status(StatusCodes.BAD_REQUEST).send();
                });
        });

        this.router.get('/cards', (req: Request, res: Response) => {
            const page = req.query.page;
            if (page) {
                const pageNb = parseInt(page.toString(), 10);
                this.gameInfo
                    .getGamesInfo(pageNb)
                    .then(
                        (gameCarousel: {
                            games: PrivateGameInformation[];
                            information: {
                                currentPage: number;
                                gamesOnPage: number;
                                nbOfGames: number;
                                nbOfPages: number;
                                hasNext: boolean;
                                hasPrevious: boolean;
                            };
                        }) => {
                            if (gameCarousel === null) {
                                res.status(StatusCodes.SERVICE_UNAVAILABLE).send();
                                return;
                            }
                            res.status(StatusCodes.OK).send({
                                carouselInfo: gameCarousel.information,
                                games: gameCarousel.games.map((game: PrivateGameInformation) => {
                                    return {
                                        id: game.id,
                                        name: game.name,
                                        thumbnail: BASE_64_HEADER + LZString.decompressFromUTF16(game.thumbnail),
                                        nbDifferences: game.differences.length,
                                        idEditedBmp: game.idEditedBmp,
                                        idOriginalBmp: game.idOriginalBmp,
                                        multiplayerScore: game.multiplayerScore,
                                        soloScore: game.soloScore,
                                    };
                                }),
                            });
                        },
                    )
                    .catch(() => {
                        res.status(StatusCodes.BAD_REQUEST).send();
                    });
            } else {
                res.status(StatusCodes.BAD_REQUEST).send();
            }
        });

        this.router.post('/card/validation', async (req: Request, res: Response) => {
            if (!req.body.original || !req.body.modify || req.body.differenceRadius === undefined) {
                res.status(StatusCodes.BAD_REQUEST).send();
                return;
            }
            try {
                const original = new Bmp({ width: req.body.original.width, height: req.body.original.height }, req.body.original.data as number[]);
                const modify = new Bmp({ width: req.body.modify.width, height: req.body.modify.height }, req.body.modify.data as number[]);

                const differenceImage = await this.gameValidation.getDifferenceBMP(original, modify, req.body.differenceRadius as number);
                const numberDifference = await this.gameValidation.findNbDifference(differenceImage);

                const isNbDifferenceValid = await this.gameValidation.isNbDifferenceValid(numberDifference);
                const imageData = Array.from((await differenceImage.toImageData()).data);

                res.status(isNbDifferenceValid ? StatusCodes.ACCEPTED : StatusCodes.NOT_ACCEPTABLE).send({
                    numberDifference,
                    width: differenceImage.getWidth(),
                    height: differenceImage.getHeight(),
                    data: imageData,
                });
            } catch (e) {
                res.status(StatusCodes.NOT_FOUND).send();
            }
        });

        this.router.post('/flutter/card/validation', async (req: Request, res: Response) => {
            if (!req.body.original || !req.body.modify || req.body.differenceRadius === undefined) {
                res.status(StatusCodes.BAD_REQUEST).send();
                return;
            }
            try {
                const original = new Bmp({ width: req.body.original.width, height: req.body.original.height }, req.body.original.data as number[]);
                const modify = new Bmp({ width: req.body.modify.width, height: req.body.modify.height }, req.body.modify.data as number[]);
                const differenceImage = await this.gameValidation.getDifferenceBMP(original, modify, req.body.differenceRadius as number);
                const numberDifference = await this.gameValidation.findNbDifference(differenceImage);

                const isNbDifferenceValid = await this.gameValidation.isNbDifferenceValid(numberDifference);

                const differenceImageBase64 = await this.gameInfo.convertToBase64(await differenceImage.toImageData());
                res.status(isNbDifferenceValid ? StatusCodes.ACCEPTED : StatusCodes.NOT_ACCEPTABLE).send({
                    nbDifferences: numberDifference,
                    differenceImage: differenceImageBase64,
                });
            } catch (e) {
                res.status(StatusCodes.NOT_FOUND).send();
            }
        });

        this.router.post('/card', async (req: Request, res: Response) => {
            if (!req.body.original || !req.body.modify || req.body.differenceRadius === undefined || req.body.name === undefined) {
                res.status(StatusCodes.BAD_REQUEST).send();
                return;
            }
            const original = new Bmp(
                { width: req.body.original.width, height: req.body.original.height },
                await Bmp.convertRGBAToARGB(req.body.original.data),
            );
            const modify = new Bmp(
                { width: req.body.modify.width, height: req.body.modify.height },
                await Bmp.convertRGBAToARGB(req.body.modify.data),
            );
            this.gameInfo
                .addGameInfoWrapper({ original, modify }, req.body.name, req.body.differenceRadius)
                .then((value) => {
                    if (value === null) {
                        res.status(StatusCodes.SERVICE_UNAVAILABLE).send();
                        return;
                    }
                    this.socketManager.refreshGames();
                    res.status(StatusCodes.CREATED).send();
                })
                .catch(() => {
                    res.status(StatusCodes.NOT_ACCEPTABLE).send();
                });
        });

        this.router.get('/constants', (req: Request, res: Response) => {
            this.gameTimeConstantService
                .getGameTimeConstant()
                .then((gameTimeConstants) => {
                    res.status(StatusCodes.OK).send(gameTimeConstants);
                })
                .catch(() => {
                    res.status(StatusCodes.BAD_REQUEST).send();
                });
        });

        this.router.patch('/constants', (req: Request, res: Response) => {
            this.gameTimeConstantService
                .setGameTimeConstant(req.body)
                .then(() => {
                    res.status(StatusCodes.OK).send();
                })
                .catch(() => {
                    res.status(StatusCodes.BAD_REQUEST).send();
                });
        });
    }
}
