import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class FindQuadrantService {
    findQuadrant(coord: Coordinate, leftUpperCoord: Coordinate, rightBottomCoord: Coordinate) {
        if (this.isInFirstQuadrant(coord, leftUpperCoord, rightBottomCoord)) {
            return [
                { x: leftUpperCoord.x + (rightBottomCoord.x - leftUpperCoord.x) / 2, y: leftUpperCoord.y },
                { x: rightBottomCoord.x, y: leftUpperCoord.y + (rightBottomCoord.y - leftUpperCoord.y) / 2 },
            ];
        }
        if (this.isInSecondQuadrant(coord, leftUpperCoord, rightBottomCoord)) {
            return [
                { x: leftUpperCoord.x, y: leftUpperCoord.y },
                {
                    x: leftUpperCoord.x + (rightBottomCoord.x - leftUpperCoord.x) / 2,
                    y: leftUpperCoord.y + (rightBottomCoord.y - leftUpperCoord.y) / 2,
                },
            ];
        }
        if (this.isInThirdQuadrant(coord, leftUpperCoord, rightBottomCoord)) {
            return [
                { x: leftUpperCoord.x, y: leftUpperCoord.y + (rightBottomCoord.y - leftUpperCoord.y) / 2 },
                { x: leftUpperCoord.x + (rightBottomCoord.x - leftUpperCoord.x) / 2, y: rightBottomCoord.y },
            ];
        }
        return [
            { x: leftUpperCoord.x + (rightBottomCoord.x - leftUpperCoord.x) / 2, y: leftUpperCoord.y + (rightBottomCoord.y - leftUpperCoord.y) / 2 },
            { x: rightBottomCoord.x, y: rightBottomCoord.y },
        ];
    }

    private isInFirstQuadrant(coord: Coordinate, leftUpperCoord: Coordinate, rightBottomCoord: Coordinate) {
        return this.isToTheRight(coord, leftUpperCoord.x, rightBottomCoord.x) && this.isOnTop(coord, leftUpperCoord.y, rightBottomCoord.y);
    }

    private isInSecondQuadrant(coord: Coordinate, leftUpperCoord: Coordinate, rightButtomCoord: Coordinate) {
        return !this.isToTheRight(coord, leftUpperCoord.x, rightButtomCoord.x) && this.isOnTop(coord, leftUpperCoord.y, rightButtomCoord.y);
    }

    private isInThirdQuadrant(coord: Coordinate, leftUpperCoord: Coordinate, rightBottomCoord: Coordinate) {
        return !this.isToTheRight(coord, leftUpperCoord.x, rightBottomCoord.x) && !this.isOnTop(coord, leftUpperCoord.y, rightBottomCoord.y);
    }

    private isToTheRight(coord: Coordinate, minValue: number, maxValue: number): boolean {
        return coord.x > minValue && coord.x > minValue + (maxValue - minValue) / 2;
    }

    private isOnTop(coord: Coordinate, minValue: number, maxValue: number) {
        return coord.y > minValue && coord.y < minValue + (maxValue - minValue) / 2;
    }
}
