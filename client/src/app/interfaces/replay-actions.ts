import { ReplayActions } from '@app/enums/replay-actions';
import { ChatMessage } from '@app/interfaces/chat-message';
import { Coordinate } from '@common/coordinate';
import { Vec2 } from './vec2';
import { GameMode } from '@common/game-mode';

export interface ClickErrorData {
    isMainCanvas: boolean;
    pos: Coordinate | Vec2;
}

export interface ReplayEvent {
    action: ReplayActions;
    timestamp: number;
    data?: ReplayPayload;
}

export type ReplayPayload = Coordinate[] | ClickErrorData | ChatMessage | string | number | GameMode;
