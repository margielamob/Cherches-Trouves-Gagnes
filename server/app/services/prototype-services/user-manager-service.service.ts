import { Service } from 'typedi';

@Service()
export class UserManagerService {
    private users: Map<string, string> = new Map();

    addUser(socketId: string, user: string) {
        if (!Array.from(this.users.values()).includes(user)) {
            this.users.set(socketId, user);
        } else {
            throw new Error('User Already Signed In');
        }
    }
    removeUser(socketId: string) {
        this.users.delete(socketId);
        console.log(this.users);
    }
}
