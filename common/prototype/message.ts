import { User } from './user';

export interface Message {
    user: User;
    message: string;
    date?: Date;
    type?: string;
}
