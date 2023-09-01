import { Coordinate } from './coordinate';

export interface DifferenceFound {
    coords: Coordinate[];
    nbDifferencesLeft: number;
    isPlayerFoundDifference?: boolean;
}
