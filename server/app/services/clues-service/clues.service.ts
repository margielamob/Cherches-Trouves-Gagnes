import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { FindQuadrantService } from '@app/services/quadrant-service/quadrant.service';
import { Coordinate } from '@common/coordinate';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@common/image-size';
import { Service } from 'typedi';
@Service()
export class CluesService {
    defaultLeftUpperCoord: Coordinate = { x: 0, y: 0 };
    defaultRightBottomCoord: Coordinate = { x: DEFAULT_IMAGE_WIDTH, y: DEFAULT_IMAGE_HEIGHT };

    constructor(private readonly gameManager: GameManagerService, private readonly quadrantService: FindQuadrantService) {}

    findRandomDifference(gameId: string): Coordinate[] | undefined {
        const gameDifferencesLeft: Coordinate[][] = this.gameManager.getNbDifferenceNotFound(gameId) as Coordinate[][];
        return gameDifferencesLeft[this.findRandomIndex(gameDifferencesLeft.length)];
    }

    findRandomPixel(gameId: string): Coordinate {
        const difference: Coordinate[] = this.findRandomDifference(gameId) as Coordinate[];
        return difference[this.findRandomIndex(difference.length)];
    }

    firstCluePosition(coord: Coordinate): Coordinate[] {
        return this.quadrantService.findQuadrant(coord, this.defaultLeftUpperCoord, this.defaultRightBottomCoord);
    }

    secondCluePosition(coord: Coordinate): Coordinate[] {
        const firstQuadrant: Coordinate[] = this.firstCluePosition(coord);
        const leftUpperCoord: Coordinate = firstQuadrant[0];
        const rightBottomCoord: Coordinate = firstQuadrant[1];
        return this.quadrantService.findQuadrant(coord, leftUpperCoord, rightBottomCoord);
    }

    thirdCluePosition(coord: Coordinate): Coordinate[] {
        return [coord, { x: -1, y: -1 }];
    }

    private findRandomIndex(length: number) {
        return Math.floor(Math.random() * length);
    }
}
