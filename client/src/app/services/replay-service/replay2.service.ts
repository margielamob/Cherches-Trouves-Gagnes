import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
import { EventQueue } from './event-queue';
import { ChatReplay, ClueReplay, DifferenceFound, DifferenceNotFound, ReplayEvent, ReplayPayload } from './replay-interfaces';

@Injectable({
    providedIn: 'root',
})
export class Replay2Service {
    isReplaying: boolean = false;
    state: ReplayState = ReplayState.STOPPED;
    gameId: string;
    private queue: EventQueue = new EventQueue();
    private startingTime: number;
    private previousEvent: ReplayEvent;
    private timeFactor: number = 1;
    private originalContext: CanvasRenderingContext2D;
    private modifiedContext: CanvasRenderingContext2D;

    constructor(private socket: CommunicationSocketService, private differenceHandler: DifferencesDetectionHandlerService) {}

    setContexts(ctxOriginal: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D) {
        this.originalContext = ctxOriginal;
        this.modifiedContext = ctxModified;
    }

    setSate(state: ReplayState) {
        this.state = state;
    }

    getQueue(): EventQueue {
        return this.queue;
    }

    setTimeFactor(factor: number) {
        this.timeFactor = factor;
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
                    this.resetQueue();
                    return;
                case ReplayState.REDO:
                    this.resetQueue();
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
            timestamp: this.getEventTime(),
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
            (obj: { data: { coords: Coordinate[]; nbDifferencesLeft: number; isPlayerFoundDifference?: boolean; playerName: string } }) => {
                const data = {
                    coords: obj.data.coords,
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

        this.socket.on(SocketEvent.GameStarted, (gameId: string) => {
            this.startingTime = Date.now();
            this.gameId = gameId;
            this.addEvent(ReplayActions.StartGame, gameId);
        });

        this.socket.on(SocketEvent.EventMessage, (eventMessage: string) => {
            this.addEvent(ReplayActions.EventMessage, eventMessage);
        });

        this.socket.on(SocketEvent.Clue, (payload: ClueReplay) => {
            this.addEvent(ReplayActions.UseHint, payload);
        });
    }

    private replayEventMessage(event: ReplayEvent) {
        const data = event.data as string;
        console.log(data);
    }

    private replayStartGame(event: ReplayEvent) {
        console.log(event);
    }

    private replayMessage(event: ReplayEvent) {
        const data = event.data as ChatReplay;
        console.log(data.message);
    }

    private replayDifferenceFound(event: ReplayEvent) {
        const data = event.data as DifferenceFound;
        this.differenceHandler.differenceDetected(this.originalContext, this.modifiedContext, data.coords);
    }

    private replayDifferenceNotFound(event: ReplayEvent) {
        const data = event.data as DifferenceNotFound;
        this.differenceHandler.differenceNotDetected(data.pos, data.isOriginal ? this.originalContext : this.modifiedContext);
    }

    private async play() {
        const event = this.queue.dequeue() as ReplayEvent;
        if (!event) {
            this.setSate(ReplayState.DONE);
            return;
        }
        await this.delay(this.timeSinceLastEvent(event) * this.timeFactor);
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
                this.replayStartGame(event);
                break;
            case ReplayActions.EventMessage:
                this.replayEventMessage(event);
                break;
        }
        this.previousEvent = event;
    }

    private getEventTime() {
        const milliseconds = Date.now() - this.startingTime;
        return milliseconds;
    }

    private timeSinceLastEvent(event: ReplayEvent) {
        return event.timestamp - this.previousEvent.timestamp;
    }

    private async delay(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(4);
            }, ms);
        });
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
