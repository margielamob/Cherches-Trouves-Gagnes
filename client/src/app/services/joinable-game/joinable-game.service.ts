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
    isClassic: boolean;
    private _joinObserveClassicGames = new BehaviorSubject<JoinableGameCard[]>([]);
    private _joinObserveLimitedGames = new BehaviorSubject<JoinableGameCard[]>([]);

    joinableClassicGames$ = this._joinObserveClassicGames.asObservable();
    joinableLimitedGames$ = this._joinObserveLimitedGames.asObservable();

    private fetchJoinableClassicGamesSubject = new Subject<void>();
    private fetchJoinableLimitedGamesSubject = new Subject<void>();

    constructor(private readonly communicationSocket: CommunicationSocketService) {
        this.initSocketListeners();
        this.initRequestHandlers();
    }

    private initSocketListeners(): void {
        this.communicationSocket.on(SocketEvent.ClassicGameCreated, (game: JoinableGameCard) => {
            const updatedClassicGames = [...this._joinObserveClassicGames.value, game];
            this._joinObserveClassicGames.next(updatedClassicGames);
        });

        this.communicationSocket.on(SocketEvent.SendingJoinableClassicGames, (payload: { games: JoinableGameCard[] }) => {
            console.log(payload.games);
            this._joinObserveClassicGames.next(payload.games);
        });

        this.communicationSocket.on(SocketEvent.LimitedGameCreated, (game: JoinableGameCard) => {
            const updatedLimitedGames = [...this._joinObserveLimitedGames.value, game];
            this._joinObserveLimitedGames.next(updatedLimitedGames);
        });

        this.communicationSocket.on(SocketEvent.SendingJoinableLimitedGames, (payload: { games: JoinableGameCard[] }) => {
            this._joinObserveLimitedGames.next(payload.games);
        });
    }

    private initRequestHandlers(): void {
        this.fetchJoinableClassicGamesSubject
            .asObservable()
            .pipe(tap(() => this.communicationSocket.send(SocketEvent.GetJoinableGames)))
            .subscribe();
        this.fetchJoinableLimitedGamesSubject
            .asObservable()
            .pipe(tap(() => this.communicationSocket.send(SocketEvent.GetJoinableGames)))
            .subscribe();
    }

    fetchJoinableGames(): void {
        if (this.isClassic) {
            console.log(this.isClassic);
            this.fetchJoinableClassicGamesSubject.next();
        } else {
            this.fetchJoinableLimitedGamesSubject.next();
        }
    }
}
