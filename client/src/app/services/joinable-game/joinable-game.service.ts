import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { JoinableGameCard } from '@common/joinable-game-card';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class JoinableGameService {
    joinableGames = new BehaviorSubject<JoinableGameCard[]>([]);

    constructor(private readonly communicationSocket: CommunicationSocketService) {
        this.handleSocketEvent();
        this.fetchJoinableGames();
    }

    handleSocketEvent() {
        this.communicationSocket.on(SocketEvent.ClassicGameCreated, (game: JoinableGameCard) => {
            this.joinableGames.next([...this.joinableGames.value, game]);
        });
    }

    fetchJoinableGames() {
        this.communicationSocket.send(SocketEvent.GetJoinableGames);
    }
}
