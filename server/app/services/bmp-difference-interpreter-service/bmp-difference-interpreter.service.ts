/* eslint-disable @typescript-eslint/prefer-for-of */
import { Bmp } from '@app/classes/bmp/bmp';
import { Pixel } from '@app/classes/pixel/pixel';
import { Queue } from '@app/classes/queue/queue';
import { Coordinate } from '@common/coordinate';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@common/image-size';
import { Service } from 'typedi';
@Service()
export class BmpDifferenceInterpreter {
    async getCoordinates(bmpDifferentiated: Bmp): Promise<Coordinate[][]> {
        const differences: Coordinate[][] = [];
        const pixels = bmpDifferentiated.getPixels();

        for (let row = 0; row < pixels.length; row++) {
            for (let column = 0; column < pixels[row].length; column++) {
                if (!pixels[row][column].isVisited && pixels[row][column].isBlack()) {
                    const difference = this.breadthFirstSearch(pixels, row, column) as Coordinate[];
                    differences.push(difference);
                }
            }
        }
        return differences;
    }

    private breadthFirstSearch(pixels: Pixel[][], row: number, column: number): Coordinate[] | undefined {
        const queue = new Queue();

        queue.add({ x: column, y: row });
        pixels[row][column].isVisited = true;

        const differenceArea: Coordinate[] = [{ x: column, y: row }];

        while (!queue.isEmpty()) {
            const coordinate = queue.peek() as Coordinate;
            queue.remove();
            const pixelNeighborsCoordinates = this.pixelNeighborsCoord(coordinate);

            for (let i = 0; i < pixelNeighborsCoordinates.length; i++) {
                const coord: Coordinate = { x: pixelNeighborsCoordinates[i].x, y: pixelNeighborsCoordinates[i].y };

                if (!pixels[coord.y][coord.x].isVisited && pixels[coord.y][coord.x].isBlack()) {
                    pixels[coord.y][coord.x].isVisited = true;
                    differenceArea.push(coord);
                    queue.add(coord);
                }
            }
        }
        return differenceArea;
    }

    private pixelNeighborsCoord(pixel: Coordinate): Coordinate[] {
        const coordinateResult: Coordinate[] = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const offsetCoord: Coordinate = { x: pixel.x + j, y: pixel.y + i };
                if (this.isCoordinateValid(offsetCoord) && (offsetCoord.x !== pixel.x || offsetCoord.y !== pixel.y)) {
                    coordinateResult.push(offsetCoord);
                }
            }
        }
        return coordinateResult;
    }

    private isCoordinateValid(coord: Coordinate) {
        return coord.x >= 0 && coord.x < DEFAULT_IMAGE_WIDTH && coord.y >= 0 && coord.y < DEFAULT_IMAGE_HEIGHT;
    }
}
