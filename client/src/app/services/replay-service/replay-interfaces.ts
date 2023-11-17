import { Vec2 } from '@app/interfaces/vec2';
import { ReplayActions } from '@app/services/replay-service/replay.service';
import { Coordinate } from '@common/coordinate';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';

export interface DifferenceNotFound {
    pos: Coordinate | Vec2;
    isOriginal: boolean;
}

export interface DifferenceFound {
    coords: Coordinate[] | Vec2[];
    pos: Coordinate | Vec2;
    playerName?: string;
}
export interface ChatReplay {
    message: string;
    roomId: string;
}

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const REPLAY_SPEEDS = [0.5, 1, 2, 3];

export interface ReplayEvent {
    action: ReplayActions;
    timestamp: number;
    data?: ReplayPayload;
    playerName?: string;
}

export interface GameInfosReplay {
    gameId: string;
    gameCard: PublicGameInformation;
}

export interface ClueReplay {
    clue: Coordinate[];
    nbClues: number;
}

export type ReplayPayload =
    | DifferenceNotFound
    | ClueReplay
    | GameInfosReplay
    | ChatReplay
    | DifferenceFound
    | Coordinate[]
    | string
    | number
    | GameMode;
