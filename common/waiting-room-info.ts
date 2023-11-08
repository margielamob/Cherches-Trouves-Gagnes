import { User } from './user';

export interface WaitingRoomInfo {
    roomId: string;
    players: User[];
    cheatMode: boolean;
}
