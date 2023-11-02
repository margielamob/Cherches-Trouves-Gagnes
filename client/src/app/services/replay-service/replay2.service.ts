import { Injectable } from '@angular/core';
import { ReplayActions } from '@app/enums/replay-actions';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
import { EventQueue } from './event-queue';
import { ChatReplay, ClickErrorData, ClueReplay, ReplayEvent, ReplayPayload } from './replay-interfaces';

@Injectable({
    providedIn: 'root',
})
export class Replay2Service {
    isReplaying: boolean = false;
    state: ReplayState = ReplayState.STOPPED;
    private queue: EventQueue = new EventQueue();
    private startingTime: Date;
    private previousEvent: ReplayEvent = { timestamp: 0 } as ReplayEvent;
    private timeFactor: number = 1;

    constructor(private socket: CommunicationSocketService, private differenceHandler: DifferencesDetectionHandlerService) {}

    setQueue(queue: EventQueue) {
        this.queue = queue;
    }

    bindReplay() {
        this.listenToEvents();
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

    setStartingTime(time: Date) {
        this.startingTime = time;
        this.queue.startingTime = time;
    }

    setTimeFactor(factor: number) {
        this.timeFactor = factor;
    }

    playEvents(): void {
        const TRUE = 1;
        while (TRUE) {
            switch (this.state) {
                case ReplayState.PLAYING:
                    this.play();
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
        this.queue.enqueue(event);
    }

    backupQueue(): void {
        this.queue.backupQueue();
    }

    resetQueue(): void {
        this.queue.resetQueue();
    }

    listenToEvents() {
        console.log('into listener');
        this.socket.on(SocketEvent.Message, (message: string) => {
            this.addEvent(ReplayActions.Message, message);
            console.log('added message to queue');
        });

        // this.socket.on(SocketEvent.DifferenceFound, () => {
        //     this.addEvent(ReplayActions.DifferenceFoundUpdate, message);
        // });

        this.socket.on(SocketEvent.DifferenceNotFound, (payload: { coord: Coordinate; ctx: CanvasRenderingContext2D }) => {
            const data = { pos: payload.coord, ctx: payload.ctx } as ClickErrorData;
            this.addEvent(ReplayActions.ClickError, data);
            console.log('added click error to queue');
        });

        this.socket.on(SocketEvent.GameStarted, (gameId: string) => {
            console.log('here');
            this.startingTime = new Date();
            this.addEvent(ReplayActions.StartGame, gameId);
            console.log('added start game to queue');
        });

        this.socket.on(SocketEvent.EventMessage, (eventMessage: string) => {
            this.addEvent(ReplayActions.EventMessage, eventMessage);
            console.log('added event message to queue');
        });

        this.socket.on(SocketEvent.Clue, (payload: ClueReplay) => {
            this.addEvent(ReplayActions.UseHint, payload);
            console.log('added clue to queue');
        });
    }

    private play() {
        const event = this.queue.dequeue() as ReplayEvent;
        switch (event.action) {
            case ReplayActions.Message:
                this.replayMessage(event);
                break;
            case ReplayActions.DifferenceFoundUpdate:
                this.replayDifferenceFound(event);
                break;
            case ReplayActions.ClickError:
                this.replayError(event);
                break;
        }
        this.previousEvent = event;
    }

    private replayMessage(event: ReplayEvent) {
        const data = event.data as ChatReplay;
        setTimeout(() => {
            this.socket.send(SocketEvent.Message, { message: data.message, roomId: data.roomId });
        }, this.timeSinceLastEvent(event) * this.timeFactor);
    }

    private replayDifferenceFound(event: ReplayEvent) {
        setTimeout(() => {
            this.differenceHandler.playCorrectSound();
        }, this.timeSinceLastEvent(event) * this.timeFactor);
    }

    private replayError(event: ReplayEvent) {
        const data = event.data as ClickErrorData;
        setTimeout(() => {
            this.differenceHandler.playWrongSound();
            this.differenceHandler.differenceNotDetected(data.pos, data.ctx);
        }, this.timeSinceLastEvent(event) * this.timeFactor);
    }

    private getEventTime() {
        const seconds = 1000;
        return Date.now() - this.startingTime.getTime() / seconds;
    }

    private timeSinceLastEvent(event: ReplayEvent) {
        return event.timestamp - this.previousEvent.timestamp;
    }
}

export enum ReplayState {
    PLAYING,
    PAUSED,
    STOPPED,
    REDO,
    DONE,
}
