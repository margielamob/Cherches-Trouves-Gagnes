/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FriendList } from '@common/friend-list';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';
import { SocketServer } from './server-socket-manager.service';
import { UserManager } from './user-manager.service';

@Service()
export class FriendListManager {
    friendLists: Map<string, FriendList> = new Map<string, FriendList>();

    constructor(private userManager: UserManager, private sio: SocketServer) {}

    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.InitFriendList, (user: User) => {
            console.log('InitFriendList');
            console.log(user);
            const friendList: FriendList = {
                user: user.name,
                friends: [],
                pendingRequests: [],
                pendingSentRequests: [],
            };
            this.friendLists.set(user.id, friendList);
            socket.emit(SocketEvent.InitFriendList, friendList);
        });

        socket.on(SocketEvent.GetAddableUsers, (user: string) => {
            const addableUsers = this.getAddableUsers(user);
            socket.emit(SocketEvent.GetAddableUsers, addableUsers);
        });

        socket.on(SocketEvent.GetFriends, (user: string) => {
            const friends = this.friendLists.get(user)?.friends || [];
            socket.emit(SocketEvent.GetFriends, friends);
        });

        socket.on(SocketEvent.SendFriendRequest, (user: string, friend: string) => {
            this.friendLists.get(user)?.pendingSentRequests.push(friend);
            this.friendLists.get(friend)?.pendingRequests.push(user);
            this.updateFriendList(socket, user, friend);
        });

        socket.on(SocketEvent.AcceptFriendRequest, (user: string, friend: string) => {
            this.friendLists.get(user)?.friends.push(friend);
            this.friendLists.get(friend)?.friends.push(user);

            this.friendLists.get(user)?.pendingRequests.splice(this.friendLists.get(user)!.pendingRequests.indexOf(friend), 1);
            this.friendLists.get(friend)?.pendingSentRequests.splice(this.friendLists.get(friend)!.pendingSentRequests.indexOf(user), 1);

            this.updateFriendList(socket, user, friend);
        });

        socket.on(SocketEvent.DeclineFriendRequest, (user: string, friend: string) => {
            this.friendLists.get(user)?.pendingRequests.splice(this.friendLists.get(user)!.pendingRequests.indexOf(friend), 1);
            this.friendLists.get(friend)?.pendingSentRequests.splice(this.friendLists.get(friend)!.pendingSentRequests.indexOf(user), 1);

            this.updateFriendList(socket, user, friend);
        });

        socket.on(SocketEvent.CancelFriendRequest, (user: string, friend: string) => {
            this.friendLists.get(user)?.pendingSentRequests.splice(this.friendLists.get(user)!.pendingSentRequests.indexOf(friend), 1);
            this.friendLists.get(friend)?.pendingRequests.splice(this.friendLists.get(friend)!.pendingRequests.indexOf(user), 1);

            this.updateFriendList(socket, user, friend);
        });

        socket.on(SocketEvent.Unfriend, (user: string, friend: string) => {
            this.friendLists.get(user)?.friends.splice(this.friendLists.get(user)!.friends.indexOf(friend), 1);
            this.friendLists.get(friend)?.friends.splice(this.friendLists.get(friend)!.friends.indexOf(user), 1);

            this.updateFriendList(socket, user, friend);
        });
    }

    getAddableUsers(currentUser: string): string[] {
        const addableUsers: string[] = [];
        const allUsers = this.friendLists.keys();
        const friends = this.friendLists.get(currentUser)?.friends || [];

        for (const user of allUsers) {
            if (user !== currentUser && !friends.includes(user)) {
                addableUsers.push(user);
            }
        }

        return addableUsers;
    }

    updateFriendList(socket: io.Socket, user: string, friend: string): void {
        const friendList = this.friendLists.get(user);
        const friendSocket = Object.keys(this.userManager.usersSocket).find((key) => this.userManager.usersSocket[key] === user)!;
        if (friendList && friendSocket) {
            this.sio.sio.to(friendSocket).emit(SocketEvent.UpdateFriendList, this.friendLists.get(friend)?.pendingRequests);
            socket.emit(SocketEvent.UpdateFriendList, this.friendLists.get(user)?.pendingSentRequests);
        }
    }
}
