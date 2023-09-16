import { Service } from 'typedi';

@Service()
export class UserManagerService {
    private users: string[] = [];
    constructor() {}

    addUser(user: string) {
        if (!this.users.includes(user)) {
            this.users.push(user);
        } else {
            throw new Error('User Already Signed In');
        }
    }
    removeUser(user: string) {
        this.users.splice(this.users.indexOf(user, 0), 1);
    }
}
