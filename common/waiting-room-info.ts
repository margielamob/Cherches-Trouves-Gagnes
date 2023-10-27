import { UserAuth } from './userAuth';

export interface WaitingRoomInfo {
    roomId: string;
    players: UserAuth[];
}
