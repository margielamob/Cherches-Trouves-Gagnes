import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { UserService } from '@app/services/user-service/user.service';
import { FriendList } from '@common/friend-list';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FriendManagerService {
    friends: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
    pendingRequests: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
    pendingSentRequests: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
    addableUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

    constructor(private socket: CommunicationSocketService, private user: UserService) {}

    handleSockets(): void {
        this.socket.socket.on(SocketEvent.UpdateFriendList, (friendList: FriendList) => {
            console.log('UpdateFriendList');
            console.log(friendList);
            this.loadFriendList(friendList);
        });
    }

    init(): void {
        this.handleSockets();
        this.socket.send(SocketEvent.InitFriendList, {
            id: this.user.activeUser.uid,
            name: this.user.activeUser.displayName,
            avatar: this.user.activeUser.photoURL,
        });
    }

    loadFriendList(friendList: FriendList): void {
        this.loadFriends(friendList.friends);
        this.loadPendingRequests(friendList.pendingRequests);
        this.loadPendingSentRequests(friendList.pendingSentRequests);
    }

    loadFriends(friends: string[]): void {
        const updatedFriends: User[] = [];
        friends.forEach((friend) => {
            this.user.getUserByUid(friend).subscribe((user) => {
                if (user) {
                    updatedFriends.push({ id: user.uid, name: user.displayName, avatar: user.photoURL });
                }
            });
        });
        this.friends.next(updatedFriends);
    }

    loadPendingRequests(pendingRequests: string[]): void {
        const updatedPendingRequests: User[] = [];
        pendingRequests.forEach((friend) => {
            this.user.getUserByUid(friend).subscribe((user) => {
                if (user) {
                    updatedPendingRequests.push({ id: user.uid, name: user.displayName, avatar: user.photoURL });
                }
            });
        });
        this.pendingRequests.next(updatedPendingRequests);
    }

    loadPendingSentRequests(pendingSentRequests: string[]): void {
        const updatedPendingSentRequests: User[] = [];
        pendingSentRequests.forEach((friend) => {
            this.user.getUserByUid(friend).subscribe((user) => {
                if (user) {
                    updatedPendingSentRequests.push({ id: user.uid, name: user.displayName, avatar: user.photoURL });
                }
            });
        });
        this.pendingSentRequests.next(updatedPendingSentRequests);
    }

    loadAddableUsers(addableUsers: string[]): void {
        const updatedAddableUsers: User[] = [];
        addableUsers.forEach((friend) => {
            this.user.getUserByUid(friend).subscribe((user) => {
                if (user) {
                    updatedAddableUsers.push({ id: user.uid, name: user.displayName, avatar: user.photoURL });
                }
            });
        });
        this.addableUsers.next(updatedAddableUsers);
    }

    getFriends(): void {
        this.socket.socket.emit(SocketEvent.GetFriends, this.user.activeUser.uid);
    }

    getAddableUsers(): void {
        this.socket.socket.emit(SocketEvent.GetAddableUsers, this.user.activeUser.uid);
    }

    sendFriendRequest(friend: string): void {
        this.socket.socket.emit(SocketEvent.SendFriendRequest, this.user.activeUser.uid, friend);
    }

    acceptFriendRequest(friend: string): void {
        this.socket.socket.emit(SocketEvent.AcceptFriendRequest, this.user.activeUser.uid, friend);
    }

    declineFriendRequest(friend: string): void {
        this.socket.socket.emit(SocketEvent.DeclineFriendRequest, this.user.activeUser.uid, friend);
    }

    cancelFriendRequest(friend: string): void {
        this.socket.socket.emit(SocketEvent.CancelFriendRequest, this.user.activeUser.uid, friend);
    }

    unfriend(friend: string): void {
        this.socket.socket.emit(SocketEvent.Unfriend, this.user.activeUser.uid, friend);
    }
}
