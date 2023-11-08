/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { ClueHandlerService } from '@app/services/clue-handler-service/clue-handler.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject } from 'rxjs';
import { EventQueue } from './event-queue';
import { ChatReplay, ClueReplay, DifferenceFound, DifferenceNotFound, ReplayEvent, ReplayPayload } from './replay-interfaces';

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
    private queue: EventQueue = new EventQueue();
    private previousEvent: ReplayEvent;
    private timeFactor: number = 1;
    private originalContext: CanvasRenderingContext2D;
    private modifiedContext: CanvasRenderingContext2D;
    private imgModifiedContext: CanvasRenderingContext2D;

    constructor(
        private socket: CommunicationSocketService,
        private differenceHandler: DifferencesDetectionHandlerService,
        private clueHandler: ClueHandlerService,
    ) {}

    setContexts(ctxOriginal: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D, ctxDifferences: CanvasRenderingContext2D) {
        this.originalContext = ctxOriginal;
        this.modifiedContext = ctxModified;
        this.differencesContext = ctxDifferences;
    }

    getQueueLength() {
        return this.queue.length;
    }

    setImageContexts(ctxImgOriginal: CanvasRenderingContext2D, ctxImgModified: CanvasRenderingContext2D) {
        this.imgOriginalContext = ctxImgOriginal;
        this.imgModifiedContext = ctxImgModified;
    }

    setSate(state: ReplayState) {
        this.state = state;
    }

    getQueue(): EventQueue {
        return this.queue;
    }

    setTimeFactor(factor: number) {
        console.log('new factor', factor);
        this.timeFactor = factor;
    }

    getTimeFactor() {
        return this.timeFactor;
    }

    async playEvents() {
        while (this.state !== ReplayState.DONE) {
            switch (this.state) {
                case ReplayState.PLAYING:
                    await this.play();
                    break;
                case ReplayState.PAUSED:
                    return;
                case ReplayState.STOPPED:
                    return;
                case ReplayState.REDO:
                    this.state = ReplayState.PLAYING;
                    break;
                default:
                    return;
            }
        }
    }

    addEvent(action: ReplayActions, data?: ReplayPayload, playerName?: string): void {
        const event = {
            action,
            data,
            playerName,
            timestamp: Date.now(),
        } as ReplayEvent;

        // adding the first event as previous event
        if (this.queue.isEmpty()) {
            this.previousEvent = event;
        }

        this.queue.enqueue(event);
    }

    backupQueue(): void {
        this.queue.backupQueue();
    }

    resetQueue(): void {
        this.queue.resetQueue();
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

        this.socket.on(SocketEvent.Clue, (payload: ClueReplay) => {
            this.addEvent(ReplayActions.UseHint, payload);
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
        this.differenceHandler.differenceDetected(this.originalContext, this.imgModifiedContext, data.coords);
        this.differenceHandler.differenceDetected(this.modifiedContext, this.imgModifiedContext, data.coords);
        this.socket.send(SocketEvent.DifferenceFoundReplay, { gameId: this.gameId, differenceCoord: data.pos });
    }

    private replayDifferenceNotFound(event: ReplayEvent) {
        const data = event.data as DifferenceNotFound;
        this.differenceHandler.differenceNotDetected(data.pos, data.isOriginal ? this.originalContext : this.modifiedContext);
    }

    private replayCheating() {
        this.cheatActivated.next(true);
    }

    // this function can be deleted if cheat mode was updated on purpose
    private async replayClue(event: ReplayEvent) {
        const data = event.data as ClueReplay;
        if (data.nbClues === 3) {
            this.isThirdClue = true;
            this.clue = '(' + data.clue[0].x.toString() + ', ' + data.clue[0].y.toString() + ')';
            setInterval(() => {
                this.isThirdClue = false;
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers  -- time to show third clue coordinates
            }, 5000);
            return;
        }
        await this.clueHandler.showClue(this.originalContext, data.clue);
        await this.clueHandler.showClue(this.modifiedContext, data.clue);
    }

    private async play() {
        const event = this.queue.dequeue() as ReplayEvent;
        if (!event) {
            this.setSate(ReplayState.DONE);
            this.resetQueue();
            return;
        }
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
            case ReplayActions.UseHint:
                await this.replayClue(event);
                break;
            case ReplayActions.ActivateCheat:
                this.replayCheating();
                break;
            default:
                throw Error('could not handle this event');
        }
        this.previousEvent = event;
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
