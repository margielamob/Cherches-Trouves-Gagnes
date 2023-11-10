/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { SocketServer } from './server-socket-manager.service';
import { UserManager } from './user-manager.service';

interface FriendList {
    user: User;
    friends: User[];
    pendingRequests: User[];
    pendingSentRequests: User[];
}

@Service()
export class FriendListManager {
    friendLists: Map<string, FriendList> = new Map<string, FriendList>();

    constructor(private userManager: UserManager, private sio: SocketServer) {}

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.GetAddableUsers, (user: User) => {
            const addableUsers = this.getAddableUsers(this.friendLists.get(user.name)?.friends || []);
            socket.emit(SocketEvent.GetAddableUsers, addableUsers);
        });

        socket.on(SocketEvent.GetFriends, (user: User) => {
            const friends = this.friendLists.get(user.name)?.friends || [];
            socket.emit(SocketEvent.GetFriends, friends);
        });

        socket.on(SocketEvent.SendFriendRequest, (user: User, friend: User) => {
            this.friendLists.get(user.name)?.pendingSentRequests.push(friend);
            this.friendLists.get(friend.name)?.pendingRequests.push(user);
            const friendSocket = Object.keys(this.userManager.users).find((key) => this.userManager.users[key] === friend.name)!;
            this.sio.sio.to(friendSocket).emit(SocketEvent.SendFriendRequest, this.friendLists.get(friend.name)?.pendingRequests);
            socket.emit(SocketEvent.SendFriendRequest, this.friendLists.get(user.name)?.pendingSentRequests);
        });

        socket.on(SocketEvent.AcceptFriendRequest, (user: User, friend: User) => {
            this.friendLists.get(user.name)?.friends.push(friend);
            this.friendLists.get(friend.name)?.friends.push(user);

            this.friendLists.get(user.name)?.pendingRequests.splice(this.friendLists.get(user.name)!.pendingRequests.indexOf(friend), 1);
            this.friendLists.get(friend.name)?.pendingSentRequests.splice(this.friendLists.get(friend.name)!.pendingSentRequests.indexOf(user), 1);

            const friendSocket = Object.keys(this.userManager.users).find((key) => this.userManager.users[key] === friend.name)!;
            this.sio.sio.to(friendSocket).emit(SocketEvent.AcceptFriendRequest, this.friendLists.get(friend.name)?.friends);
            socket.emit(SocketEvent.AcceptFriendRequest, this.friendLists.get(user.name)?.friends);
        });

        socket.on(SocketEvent.DeclineFriendRequest, (user: User, friend: User) => {
            this.friendLists.get(user.name)?.pendingRequests.splice(this.friendLists.get(user.name)!.pendingRequests.indexOf(friend), 1);
            this.friendLists.get(friend.name)?.pendingSentRequests.splice(this.friendLists.get(friend.name)!.pendingSentRequests.indexOf(user), 1);

            const friendSocket = Object.keys(this.userManager.users).find((key) => this.userManager.users[key] === friend.name)!;
            this.sio.sio.to(friendSocket).emit(SocketEvent.DeclineFriendRequest, this.friendLists.get(friend.name)?.pendingRequests);
            socket.emit(SocketEvent.DeclineFriendRequest, this.friendLists.get(user.name)?.pendingSentRequests);
        });

        socket.on(SocketEvent.CancelFriendRequest, (user: User, friend: User) => {
            this.friendLists.get(user.name)?.pendingSentRequests.splice(this.friendLists.get(user.name)!.pendingSentRequests.indexOf(friend), 1);
            this.friendLists.get(friend.name)?.pendingRequests.splice(this.friendLists.get(friend.name)!.pendingRequests.indexOf(user), 1);

            const friendSocket = Object.keys(this.userManager.users).find((key) => this.userManager.users[key] === friend.name)!;
            this.sio.sio.to(friendSocket).emit(SocketEvent.CancelFriendRequest, this.friendLists.get(friend.name)?.pendingRequests);
            socket.emit(SocketEvent.CancelFriendRequest, this.friendLists.get(user.name)?.pendingSentRequests);
        });

        socket.on(SocketEvent.Unfriend, (user: User, friend: User) => {
            this.friendLists.get(user.name)?.friends.splice(this.friendLists.get(user.name)!.friends.indexOf(friend), 1);
            this.friendLists.get(friend.name)?.friends.splice(this.friendLists.get(friend.name)!.friends.indexOf(user), 1);

            const friendSocket = Object.keys(this.userManager.users).find((key) => this.userManager.users[key] === friend.name)!;
            this.sio.sio.to(friendSocket).emit(SocketEvent.Unfriend, this.friendLists.get(friend.name)?.friends);
            socket.emit(SocketEvent.Unfriend, this.friendLists.get(user.name)?.friends);
        });
    }

    getAddableUsers(friends: User[]): User[] {
        const addableUsers: User[] = [];
        this.userManager.users.forEach((user) => {
            if (!friends.includes(user)) {
                addableUsers.push(user);
            }
        });
        return addableUsers;
    }
}
