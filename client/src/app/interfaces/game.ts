import { Color } from '@app/interfaces/color';

export interface Game {
    id: string;
    name: string;
    src: Color[][];
    diff: Color[][];
    expansionRadius: number;
}
