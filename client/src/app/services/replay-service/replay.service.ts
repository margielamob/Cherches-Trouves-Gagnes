/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject } from 'rxjs';
import { EventArray } from './event-array';
import { ChatReplay, DifferenceFound, DifferenceNotFound, ReplayEvent, ReplayPayload } from './replay-interfaces';

@Injectable({
    providedIn: 'root',
})
export class ReplayService {
    // subscriptions:
    hasReplayStarted = new BehaviorSubject<boolean>(false);
    hasReplayStarted$ = this.hasReplayStarted.asObservable();
    imagesLoaded = new BehaviorSubject<boolean>(false);
    imagesLoaded$ = this.imagesLoaded.asObservable();
    cheatActivated = new BehaviorSubject<boolean>(false);
    cheatActivated$ = this.cheatActivated.asObservable();
    // public props
    isReplaying: boolean = false;
    state: ReplayState = ReplayState.STOPPED;
    gameId: string;
    differencesContext: CanvasRenderingContext2D;
    imgOriginalContext: CanvasRenderingContext2D;
    isThirdClue: boolean = false;
    clue: string;
    // private props
    private array: EventArray = new EventArray();
    private previousEvent: ReplayEvent;
    private timeFactor: number = 1;
    private originalContext: CanvasRenderingContext2D;
    private modifiedContext: CanvasRenderingContext2D;
    private imgModifiedContext: CanvasRenderingContext2D;

    constructor(private socket: CommunicationSocketService, private differenceHandler: DifferencesDetectionHandlerService) {}

    setContexts(ctxOriginal: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D, ctxDifferences: CanvasRenderingContext2D) {
        this.originalContext = ctxOriginal;
        this.modifiedContext = ctxModified;
        this.differencesContext = ctxDifferences;
    }

    length() {
        return this.array.length;
    }

    setImageContexts(ctxImgOriginal: CanvasRenderingContext2D, ctxImgModified: CanvasRenderingContext2D) {
        this.imgOriginalContext = ctxImgOriginal;
        this.imgModifiedContext = ctxImgModified;
    }

    setSate(state: ReplayState) {
        this.state = state;
    }

    getArray(): EventArray {
        return this.array;
    }

    setTimeFactor(factor: number) {
        console.log('new factor', factor);
        this.timeFactor = factor;
    }

    getTimeFactor() {
        return this.timeFactor;
    }

    getCurrentIndex() {
        return this.array.currentIndex;
    }

    setCurrentIndex(pos: number) {
        this.array.currentIndex = pos;
    }

    addEvent(action: ReplayActions, data?: ReplayPayload, playerName?: string): void {
        const event = {
            action,
            data,
            playerName,
            timestamp: Date.now(),
        } as ReplayEvent;

        if (this.array.isEmpty()) {
            this.previousEvent = event;
        }

        this.array.push(event);
    }

    async playFromIndex(index: number = this.array.currentIndex) {
        this.array.currentIndex = index;

        while (this.state !== ReplayState.DONE) {
            if (this.array.end()) {
                this.setSate(ReplayState.DONE);
                return;
            }

            const event = this.array.getCurrentEvent();
            await this.delay(this.timeSinceLastEvent(event) / this.timeFactor);
            switch (event.action) {
                case ReplayActions.Message:
                    this.replayMessage(event);
                    break;
                case ReplayActions.DifferenceFoundUpdate:
                    this.replayDifferenceFound(event);
                    break;
                case ReplayActions.ClickError:
                    this.replayDifferenceNotFound(event);
                    break;
                case ReplayActions.StartGame:
                    this.replayStartGame();
                    break;
                case ReplayActions.EventMessage:
                    this.replayEventMessage(event);
                    break;
                case ReplayActions.ActivateCheat:
                    this.replayCheating();
                    break;
                default:
                    throw Error('could not handle this event');
            }
            this.previousEvent = event;
            this.array.currentIndex++;
        }
    }

    listenToEvents() {
        this.socket.on(SocketEvent.Message, (message: string) => {
            const data: ChatReplay = {
                message,
                roomId: this.gameId,
            };
            this.addEvent(ReplayActions.Message, data);
        });

        this.socket.on(
            SocketEvent.DifferenceFound,
            (obj: {
                data: {
                    coords: Coordinate[];
                    nbDifferencesLeft: number;
                    isPlayerFoundDifference?: boolean;
                };
                differenceCoord: Coordinate;
                playerName: string;
            }) => {
                const data = {
                    coords: obj.data.coords,
                    pos: obj.differenceCoord,
                } as DifferenceFound;
                this.addEvent(ReplayActions.DifferenceFoundUpdate, data);
            },
        );

        this.socket.on(SocketEvent.DifferenceNotFound, (payload: { differenceCoord: Coordinate; isOriginal: boolean }) => {
            const data = {
                pos: payload.differenceCoord,
                isOriginal: payload.isOriginal,
            } as DifferenceNotFound;
            this.addEvent(ReplayActions.ClickError, data);
        });

        this.socket.once(SocketEvent.GameStarted, (gameId: string) => {
            this.gameId = gameId;
            this.addEvent(ReplayActions.StartGame, gameId);
        });

        this.socket.on(SocketEvent.EventMessage, (eventMessage: string) => {
            this.addEvent(ReplayActions.EventMessage, eventMessage);
        });

        this.socket.on(SocketEvent.Cheat, () => {
            this.addEvent(ReplayActions.ActivateCheat);
        });
    }

    private replayEventMessage(event: ReplayEvent) {
        const data = event.data as string;
        console.log(data);
    }

    private replayStartGame() {
        this.resetGameInfos();
        this.hasReplayStarted.next(true);
    }

    private replayMessage(event: ReplayEvent) {
        const data = event.data as ChatReplay;
        console.log(data.message);
    }

    private replayDifferenceFound(event: ReplayEvent) {
        const data = event.data as DifferenceFound;
        this.differenceHandler.differenceDetected(this.originalContext, this.imgModifiedContext, data.coords, this.timeFactor);
        this.differenceHandler.differenceDetected(this.modifiedContext, this.imgModifiedContext, data.coords, this.timeFactor);
        this.socket.send(SocketEvent.DifferenceFoundReplay, { gameId: this.gameId, differenceCoord: data.pos });
    }

    private replayDifferenceNotFound(event: ReplayEvent) {
        const data = event.data as DifferenceNotFound;
        this.differenceHandler.differenceNotDetected(data.pos, data.isOriginal ? this.originalContext : this.modifiedContext, this.timeFactor);
    }

    private replayCheating() {
        this.cheatActivated.next(true);
    }

    private timeSinceLastEvent(event: ReplayEvent) {
        return event.timestamp - this.previousEvent.timestamp;
    }

    private async delay(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    private resetGameInfos() {
        this.socket.send(SocketEvent.ResetGameInfosReplay, { gameId: this.gameId });
    }
}

export enum ReplayState {
    PLAYING,
    PAUSED,
    STOPPED,
    REDO,
    DONE,
    START,
}

export enum ReplayActions {
    StartGame = 'StartGame',
    ClickFound = 'ClickFound',
    ClickError = 'ClickError',
    Message = 'Message',
    ActivateCheat = 'ActivateCheat',
    DeactivateCheat = 'DeactivateCheat',
    UseHint = 'UseHint',
    TimerUpdate = 'TimerUpdate',
    DifferenceFoundUpdate = 'DifferenceFoundUpdate',
    OpponentDifferencesFoundUpdate = 'OpponentDifferencesFoundUpdate',
    EndGame = 'EndGame',
    ActivateThirdHint = 'ActivateThirdHint',
    DeactivateThirdHint = 'DeactivateThirdHint',
    EventMessage = 'EventMessage',
}
