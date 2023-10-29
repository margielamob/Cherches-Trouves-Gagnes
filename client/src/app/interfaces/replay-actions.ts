import { ReplayActions } from '@app/enums/replay-actions';
import { Coordinate } from '@common/coordinate';
import { ChatMessage } from '@app/interfaces/chat-message';
import { PublicGameInformation } from '@common/game-information';

export interface ClickErrorData {
    isMainCanvas: boolean;
    pos: Coordinate;
}

export interface ReplayEvent {
    action: ReplayActions;
    timestamp: number;
    data?: ReplayPayload;
    gameInformation?: PublicGameInformation;
}

export type ReplayPayload = Coordinate[] | ClickErrorData | ChatMessage | string | number | PublicGameInformation;
