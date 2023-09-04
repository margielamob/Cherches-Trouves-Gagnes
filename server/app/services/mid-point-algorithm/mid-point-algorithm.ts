import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class MidpointAlgorithm {
    findEnlargementArea(center: BmpCoordinate, radius: number) {
        return this.findInsideAreaEnlargement(center, radius, this.findContourEnlargement(center, radius));
    }

    private findContourEnlargement(center: BmpCoordinate, radius: number): BmpCoordinate[] {
        const coordinates: BmpCoordinate[] = new Array();

        if (radius === 0) {
            coordinates.push(new BmpCoordinate(center.getX(), center.getY()));
            return coordinates;
        }

        const distance: Coordinate = { x: radius, y: 0 };

        this.addInitial4Coords(center, distance, coordinates);

        let perimeter = 1 - radius;

        while (this.isInQuadrant(distance)) {
            distance.y++;

            perimeter = this.incrementPerimeter(perimeter, distance);
            if (this.isOutsideQuadrant(distance)) {
                break;
            }

            this.addAllCoords(center, distance, coordinates);
        }
        return coordinates;
    }

    private isInQuadrant(distance: Coordinate) {
        return distance.x > distance.y;
    }

    private isOutsideQuadrant(distance: Coordinate) {
        return distance.x < distance.y;
    }

    private invertDistance(distance: Coordinate) {
        return { x: distance.y, y: distance.x };
    }

    private perimeterIsNegative(perimeter: number): boolean {
        return perimeter <= 0;
    }

    private isNotEquidistant(distance: Coordinate) {
        return distance.x !== distance.y;
    }

    private incrementPerimeter(perimeter: number, distance: Coordinate): number {
        if (this.perimeterIsNegative(perimeter)) {
            return perimeter + 2 * distance.y + 1;
        } else {
            distance.x--;
            return perimeter + 2 * distance.y - 2 * distance.x + 1;
        }
    }

    private addCoord(coordinate: BmpCoordinate, coordinates: BmpCoordinate[]) {
        if (coordinate.getX() !== undefined && coordinate.getY() !== undefined) {
            coordinates.push(coordinate);
        }
    }

    private addInitial4Coords(center: BmpCoordinate, distance: Coordinate, coordinates: BmpCoordinate[]) {
        this.addCoord(new BmpCoordinate(center.getX() + distance.x, center.getY()), coordinates);
        this.addCoord(new BmpCoordinate(center.getX() - distance.x, center.getY()), coordinates);
        this.addCoord(new BmpCoordinate(center.getX(), center.getY() + distance.x), coordinates);
        this.addCoord(new BmpCoordinate(center.getX(), center.getY() - distance.x), coordinates);
    }

    private addCoordsIn4Quadrants(center: BmpCoordinate, distance: Coordinate, coordinates: BmpCoordinate[]) {
        this.addCoord(new BmpCoordinate(center.getX() + distance.x, center.getY() + distance.y), coordinates);
        this.addCoord(new BmpCoordinate(center.getX() - distance.x, center.getY() + distance.y), coordinates);
        this.addCoord(new BmpCoordinate(center.getX() + distance.x, center.getY() - distance.y), coordinates);
        this.addCoord(new BmpCoordinate(center.getX() - distance.x, center.getY() - distance.y), coordinates);
    }

    private addAllCoords(center: BmpCoordinate, distance: Coordinate, coordinates: BmpCoordinate[]) {
        this.addCoordsIn4Quadrants(center, distance, coordinates);

        if (this.isNotEquidistant(distance)) {
            this.addCoordsIn4Quadrants(center, this.invertDistance(distance), coordinates);
        }
    }

    private distance(px1: Coordinate, px2: Coordinate) {
        let dx = px2.x - px1.x;
        dx = dx * dx;
        let dy = px2.y - px1.y;
        dy = dy * dy;
        return Math.sqrt(dx + dy);
    }

    private findInsideAreaEnlargement(coord: BmpCoordinate, radius: number, coordinates: BmpCoordinate[]) {
        for (let j = coord.getX() - radius; j <= coord.getX() + radius; j++) {
            for (let k = coord.getY() - radius; k <= coord.getY() + radius; k++) {
                if (this.distance({ x: j, y: k }, { x: coord.getX(), y: coord.getY() }) <= radius) coordinates.push(new BmpCoordinate(j, k));
            }
        }
        return coordinates;
    }
}
