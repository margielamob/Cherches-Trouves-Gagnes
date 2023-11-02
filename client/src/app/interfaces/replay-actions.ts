import { ReplayActions } from '@app/enums/replay-actions';
import { ChatMessage } from '@app/interfaces/chat-message';
import { Coordinate } from '@common/coordinate';
import { GameMode } from '@common/game-mode';
import { Vec2 } from './vec2';

export interface ClickErrorData {
    isMainCanvas: boolean;
    pos: Coordinate | Vec2;
    ctx?: CanvasRenderingContext2D;
    ctxModified?: CanvasRenderingContext2D;
}

export interface ClickFound {
    isMainCanvas: boolean;
    pos: Coordinate[] | Vec2[];
    ctx?: CanvasRenderingContext2D;
    ctxModified?: CanvasRenderingContext2D;
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

export type ReplayPayload = ChatReplay | ClickFound | Coordinate[] | ClickErrorData | ChatMessage | string | number | GameMode;
