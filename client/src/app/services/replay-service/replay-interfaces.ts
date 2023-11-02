import { ReplayActions } from '@app/enums/replay-actions';
import { Vec2 } from '@app/interfaces/vec2';
import { Coordinate } from '@common/coordinate';
import { PublicGameInformation } from '@common/game-information';
import { GameMode } from '@common/game-mode';

export interface ClickErrorData {
    pos: Coordinate | Vec2;
    ctx: CanvasRenderingContext2D;
}

export interface ClickFound {
    pos: Coordinate | Vec2;
    coords: Coordinate[] | Vec2[];
    ctx: CanvasRenderingContext2D;
}
export interface ChatReplay {
    message: string;
    roomId: string;
}

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

export type ReplayPayload = ClueReplay | GameInfosReplay | ChatReplay | ClickFound | Coordinate[] | ClickErrorData | string | number | GameMode;
