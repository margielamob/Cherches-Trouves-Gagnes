import { ReplayActions } from '@app/enums/replay-actions';
import { ChatMessage } from '@app/interfaces/chat-message';
import { Coordinate } from '@common/coordinate';

export interface ClickErrorData {
    isMainCanvas: boolean;
    pos: Coordinate;
}

export interface ReplayEvent {
    action: ReplayActions;
    timestamp: number;
    data?: Coordinate[] | ClickErrorData | ChatMessage | string | number;
}
