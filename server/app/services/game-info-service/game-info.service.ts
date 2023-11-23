import { Bmp } from '@app/classes/bmp/bmp';
import { DB_GAME_COLLECTION } from '@app/constants/database';
import { GameCarousel } from '@app/interface/game-carousel';
import { PrivateGameInformation } from '@app/interface/game-info';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { ImageRepositoryService } from '@app/services/image-repository/image-repository.service';
import { LoggerService } from '@app/services/logger-service/logger.service';
import { Score } from '@common/score';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
import { v4 } from 'uuid';
// eslint-disable-next-line @typescript-eslint/no-require-imports -- can't import this otherwise
import LZString = require('lz-string');

const NB_TO_RETRIEVE = 4;

@Service()
export class GameInfoService {
    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly bmpService: BmpService,
        private readonly bmpSubtractorService: BmpSubtractorService,
        private readonly bmpDifferenceInterpreter: BmpDifferenceInterpreter,
        private readonly imageRepo: ImageRepositoryService,
        private readonly logger: LoggerService,
    ) {}

    get collection(): Collection<PrivateGameInformation> {
        return this.databaseService.database.collection(DB_GAME_COLLECTION);
    }

    async getGamesInfo(pageNb: number): Promise<GameCarousel | null> {
        try {
            const nbOfGames = await this.collection.countDocuments();
            const nbOfPages = Math.ceil(nbOfGames / NB_TO_RETRIEVE);
            const currentPage = this.validatePageNumber(pageNb, nbOfPages);

            // skip pages to only retrieve the one we want
            const games = await this.collection.find({}, { skip: (currentPage - 1) * NB_TO_RETRIEVE, limit: NB_TO_RETRIEVE }).toArray();

            return {
                games,
                information: {
                    currentPage,
                    gamesOnPage: games.length,
                    nbOfGames,
                    nbOfPages,
                    hasNext: currentPage < nbOfPages,
                    hasPrevious: currentPage > 1,
                },
            };
        } catch (err) {
            return null;
        }
    }

    async getAllGameInfos(): Promise<PrivateGameInformation[] | null> {
        try {
            return await this.collection.find({}).toArray();
        } catch (err) {
            return null;
        }
    }

    async getGameInfoById(gameId: string): Promise<PrivateGameInformation | null> {
        try {
            return (await this.collection.find({ id: gameId }).toArray())[0];
        } catch (err) {
            return null;
        }
    }

    async convertToBase64(imageData: ImageData) {
        return await this.bmpService.convertToBase64(imageData);
    }

    async addGameInfoWrapper(images: { original: Bmp; modify: Bmp }, name: string, radius: number): Promise<void | null> {
        try {
            const originalRef = await this.bmpService.createImageRef(await images.original.toImageData());
            const editedRef = await this.bmpService.createImageRef(await images.modify.toImageData());
            const differences = await this.bmpDifferenceInterpreter.getCoordinates(
                await this.bmpSubtractorService.getDifferenceBMP(images.original, images.modify, radius),
            );
            const compressedThumbnail = LZString.compressToUTF16(editedRef.base64String);

            await Promise.all([
                this.imageRepo.insertOne(originalRef),
                this.imageRepo.insertOne(editedRef),
                this.addGameInfo({
                    id: v4(),
                    name,
                    idOriginalBmp: originalRef.id,
                    idEditedBmp: editedRef.id,
                    thumbnail: compressedThumbnail,
                    differenceRadius: radius,
                    differences,
                    soloScore: [],
                    multiplayerScore: [],
                }),
            ]);
            this.logger.logInfo('new game added to database');
        } catch (err) {
            this.logger.logError(err);
            return null;
        }
    }

    async addGameInfo(game: PrivateGameInformation): Promise<void> {
        await this.collection.insertOne(game);
    }

    async deleteGameInfoById(gameId: string): Promise<boolean | null> {
        try {
            const filter = { id: { $eq: gameId } };
            const deletedGame = (await this.collection.findOneAndDelete(filter)).value;

            if (deletedGame) {
                const imageIds = [deletedGame.idOriginalBmp, deletedGame.idEditedBmp];
                for (const id of imageIds) {
                    await this.imageRepo.destroyOneDocument(id);
                }
            }

            return deletedGame !== null;
        } catch (err) {
            return null;
        }
    }

    async deleteAllGamesInfo(): Promise<void | null> {
        try {
            await Promise.all([this.collection.deleteMany({}), this.imageRepo.destroyAllDocuments()]);
        } catch (err) {
            return null;
        }
    }

    async resetAllHighScores(): Promise<void | null> {
        try {
            await this.collection.updateMany({}, { $set: { soloScore: [], multiplayerScore: [] } });
        } catch (err) {
            return null;
        }
    }

    async resetHighScores(gameId: string): Promise<void | null> {
        try {
            await this.collection.updateOne({ id: gameId }, { $set: { soloScore: [], multiplayerScore: [] } });
        } catch (err) {
            return null;
        }
    }

    async getHighScores(gameId: string): Promise<{ soloScore: Score[]; multiplayerScore: Score[] } | null> {
        try {
            const game = (await this.getGameInfoById(gameId)) as PrivateGameInformation;
            return { soloScore: game.soloScore, multiplayerScore: game.multiplayerScore };
        } catch (err) {
            return null;
        }
    }

    async updateHighScores(gameId: string, soloScore: Score[], multiplayerScore: Score[]): Promise<void | null> {
        try {
            await this.collection.updateOne({ id: gameId }, { $set: { soloScore, multiplayerScore } });
        } catch (err) {
            return null;
        }
    }

    private validatePageNumber(pageNb: number, total: number): number {
        return pageNb < 1 ? 1 : pageNb > total ? 1 : pageNb;
    }
}
