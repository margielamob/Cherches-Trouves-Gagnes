import { User } from './user';

export interface Message {
    user: User;
    message: string;
    date?: string;
    type?: string;
    userType: string;
}
