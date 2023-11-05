import { Injectable } from '@angular/core';
import { ReplayActions } from '@app/enums/replay-actions';
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
    private startingTime: Date;
    private previousEvent: ReplayEvent;
    private timeFactor: number = 10;
    private originalContext: CanvasRenderingContext2D;
    private modifiedContext: CanvasRenderingContext2D;

    constructor(private socket: CommunicationSocketService, private differenceHandler: DifferencesDetectionHandlerService) {}

    setQueue(queue: EventQueue) {
        this.queue = queue;
    }

    bindReplay() {
        this.listenToEvents();
    }

    setContexts(ctxOriginal: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D) {
        this.originalContext = ctxOriginal;
        this.modifiedContext = ctxModified;
    }

    start(startingTime: Date, evenQueue: EventQueue) {
        this.startingTime = startingTime;
        this.queue = evenQueue;
        this.isReplaying = true;
        this.setSate(ReplayState.PLAYING);
        this.playEvents();
    }

    setSate(state: ReplayState) {
        this.state = state;
    }

    getQueue(): EventQueue {
        return this.queue;
    }

    setStartingTime(time: Date) {
        this.startingTime = time;
        this.queue.startingTime = time;
    }

    setTimeFactor(factor: number) {
        this.timeFactor = factor;
    }

    async playEvents() {
        while (this.state !== ReplayState.DONE) {
            console.log('state', this.state);

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
        console.log('done playing');
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

        this.socket.on(SocketEvent.DifferenceFound, (numberOfDiffs: number) => {
            this.addEvent(ReplayActions.DifferenceFoundUpdate);
            console.log('difference found', numberOfDiffs);
        });

        this.socket.on(SocketEvent.DifferenceNotFound, (payload: { differenceCoord: Coordinate; isOriginal: boolean }) => {
            const data = {
                pos: payload.differenceCoord,
                isOriginal: payload.isOriginal,
            } as DifferenceNotFound;
            this.addEvent(ReplayActions.ClickError, data);
        });

        this.socket.on(SocketEvent.GameStarted, (gameId: string) => {
            this.startingTime = new Date();
            this.gameId = gameId;
            this.addEvent(ReplayActions.StartGame, gameId);
            console.log('gameId', gameId);
        });

        this.socket.on(SocketEvent.EventMessage, (eventMessage: string) => {
            this.addEvent(ReplayActions.EventMessage, eventMessage);
        });

        this.socket.on(SocketEvent.Clue, (payload: ClueReplay) => {
            this.addEvent(ReplayActions.UseHint, payload);
        });
    }

    private async replayEventMessage(event: ReplayEvent) {
        const data = event.data as string;
        const time = this.timeSinceLastEvent(event) * this.timeFactor;
        await this.delay(time);
        console.log(data);
        console.log('event message replayed ');
    }

    private async replayStartGame(event: ReplayEvent) {
        const time = this.timeSinceLastEvent(event) * this.timeFactor;
        await this.delay(time);
    }

    private async replayMessage(event: ReplayEvent) {
        const data = event.data as ChatReplay;
        console.log('message data: ', data);
        const time = this.timeSinceLastEvent(event) * this.timeFactor;
        await this.delay(time);
        console.log('event message replayed ');
    }

    private async replayDifferenceFound(event: ReplayEvent) {
        const time = this.timeSinceLastEvent(event) * this.timeFactor;
        await this.delay(time);
        this.differenceHandler.playCorrectSound();
        const data = event.data as DifferenceFound;
        console.log(data);
    }

    private async replayDifferenceNotFound(event: ReplayEvent) {
        const data = event.data as DifferenceNotFound;
        const time = this.timeSinceLastEvent(event) * this.timeFactor;
        await this.delay(time);
        this.differenceHandler.playWrongSound();
        this.differenceHandler.differenceNotDetected(data.pos, data.isOriginal ? this.originalContext : this.modifiedContext);
    }

    private async play() {
        const event = this.queue.dequeue() as ReplayEvent;
        if (!event) {
            this.setSate(ReplayState.DONE);
            return;
        }
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
        const milliseconds = Date.now() - this.startingTime.getTime();
        return milliseconds;
    }

    private timeSinceLastEvent(event: ReplayEvent) {
        console.log('timesince', event.timestamp - this.previousEvent.timestamp);
        return event.timestamp - this.previousEvent.timestamp;
    }

    private async delay(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
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
