import { Game } from '@app/classes/game/game';
import { Coordinate } from '@common/coordinate';
import { Service } from 'typedi';

@Service()
export class DifferenceService {
    private gamesDifferencesFound: Map<string, Map<string, Set<Coordinate[]>>>;
    private gamesDifferencesTotalFound: Map<string, Set<Coordinate[]>>;

    constructor() {
        this.gamesDifferencesFound = new Map();
        this.gamesDifferencesTotalFound = new Map();
    }

    totalDifferenceFound(gameId: string) {
        return this.gamesDifferencesTotalFound.get(gameId);
    }

    setGameDifferences(gameId: string) {
        this.gamesDifferencesFound.set(gameId, new Map());
        this.gamesDifferencesTotalFound.set(gameId, new Set());
    }

    setPlayerDifferences(gameId: string, playerId: string) {
        const game = this.gamesDifferencesFound.get(gameId);
        if (!game) {
            return null;
        }
        game.set(playerId, new Set());
        return;
    }

    findDifference(differenceCoords: Coordinate, differencesRef: Coordinate[][]): Coordinate[] | undefined {
        return differencesRef.find((difference: Coordinate[]) =>
            difference.find((coord: Coordinate) => coord.x === differenceCoords.x && coord.y === differenceCoords.y),
        );
    }

    isDifferenceFound(playerId: string, difference: Coordinate, game: Game) {
        const differences = this.findDifference(difference, game.information.differences);
        if (!differences || this.isDifferenceAlreadyFound(differences, game.identifier)) {
            return null;
        }
        this.addCoordinatesOnDifferenceFound(playerId, differences, game);
        return differences;
    }

    addCoordinatesOnDifferenceFound(playerId: string, differenceCoords: Coordinate[], game: Game) {
        const player = (this.gamesDifferencesFound.get(game.identifier) as Map<string, Set<Coordinate[]>>).get(playerId);
        if (this.isDifferenceAlreadyFound(differenceCoords, game.identifier) || !player) {
            return;
        }
        (this.gamesDifferencesTotalFound.get(game.identifier) as Set<Coordinate[]>).add(differenceCoords);
        player.add(differenceCoords);
        if (this.isAllDifferenceFound(playerId, game) && !game.isGameOver() && game.isClassic()) {
            game.setEndgame();
        }
    }

    isDifferenceAlreadyFound(differenceCoords: Coordinate[], gameId: string) {
        return (this.gamesDifferencesTotalFound.get(gameId) as Set<Coordinate[]>).has(differenceCoords);
    }

    isAllDifferenceFound(playerId: string, game: Game): boolean {
        const player = (this.gamesDifferencesFound.get(game.identifier) as Map<string, Set<Coordinate[]>>).get(playerId);

        // if the game is already over all the differences are found and if the game is not initialize, 0 difference found
        if (game.isGameInitialize() || game.isGameOver() || !player) {
            return game.isGameOver();
        }

        return game.multi
            ? player.size === this.getNbDifferencesThreshold(game.information.differences)
            : player.size === game.information.differences.length;
    }

    getNbDifferencesThreshold(differencesRef: Coordinate[][]) {
        return differencesRef.length % 2 === 0 ? differencesRef.length / 2 : Math.trunc(differencesRef.length / 2) + 1;
    }

    getAllDifferencesNotFound(differencesRef: Coordinate[][], gameId: string) {
        return differencesRef.filter(
            (difference: Coordinate[]) => !(this.gamesDifferencesTotalFound.get(gameId) as Set<Coordinate[]>).has(difference),
        );
    }

    nbDifferencesLeft(differencesRef: Coordinate[][], gameId: string): number {
        return differencesRef.length - (this.gamesDifferencesTotalFound.get(gameId) as Set<Coordinate[]>).size;
    }
}
