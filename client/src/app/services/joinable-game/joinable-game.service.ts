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
            let updatedClassicGames = this._joinObserveClassicGames.value;

            // Check if the game with the same gameId already exists
            const existingGameIndex = updatedClassicGames.findIndex((g) => g.gameInformation.id === game.gameInformation.id);

            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            if (existingGameIndex > -1) {
                // Replace the existing game with the new one
                updatedClassicGames[existingGameIndex] = game;
            } else {
                // Add the new game to the list
                updatedClassicGames = [...updatedClassicGames, game];
            }

            // Emit the updated list
            this._joinObserveClassicGames.next(updatedClassicGames);
        });

        this.communicationSocket.on(SocketEvent.SendingJoinableClassicGames, (payload: { games: JoinableGameCard[] }) => {
            this._joinObserveClassicGames.next(payload.games);
        });

        this.communicationSocket.on(SocketEvent.LimitedGameCreated, (game: JoinableGameCard) => {
            let updatedLimitedGames = this._joinObserveLimitedGames.value;

            // Check if the game with the same gameId already exists
            const existingGameIndex = updatedLimitedGames.findIndex((g) => g.gameInformation.id === game.gameInformation.id);

            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            if (existingGameIndex > -1) {
                // Replace the existing game with the new one
                updatedLimitedGames[existingGameIndex] = game;
            } else {
                // Add the new game to the list
                updatedLimitedGames = [...updatedLimitedGames, game];
            }

            // Emit the updated list
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
            .pipe(tap(() => this.communicationSocket.send(SocketEvent.GetLimitedTimeGames)))
            .subscribe();
    }

    fetchJoinableGames(): void {
        if (this.isClassic) {
            this.fetchJoinableClassicGamesSubject.next();
        } else {
            this.fetchJoinableLimitedGamesSubject.next();
        }
    }
}
