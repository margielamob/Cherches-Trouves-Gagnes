/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { JoinableGameCard } from '@common/joinable-game-card';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject, Subject, tap } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class JoinableGameService {
    private _joinableGames = new BehaviorSubject<JoinableGameCard[]>([]);
    private fetchGamesSubject = new Subject<void>();

    joinableGames$ = this._joinableGames.asObservable();

    constructor(private readonly communicationSocket: CommunicationSocketService) {
        this.initSocketListeners();
        this.initRequestHandlers();
    }

    private initSocketListeners(): void {
        this.communicationSocket.on(SocketEvent.ClassicGameCreated, (game: JoinableGameCard) => {
            const updatedGames = [...this._joinableGames.value, game];
            this._joinableGames.next(updatedGames);
        });

        this.communicationSocket.on(SocketEvent.SendingJoinableClassicGames, (payload: { games: JoinableGameCard[] }) => {
            console.log(payload.games.length);
            this._joinableGames.next(payload.games);
        });
    }

    private initRequestHandlers(): void {
        this.fetchGamesSubject
            .asObservable()
            .pipe(tap(() => this.communicationSocket.send(SocketEvent.GetJoinableGames)))
            .subscribe();
    }

    fetchJoinableGames(): void {
        this.fetchGamesSubject.next();
    }
}
