import { UserAuth } from '@common/userAuth';

export interface GameUser {
    socketId: string;
    user: UserAuth;
}
