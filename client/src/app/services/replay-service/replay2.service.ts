import { Injectable } from '@angular/core';
import { ReplayActions } from '@app/enums/replay-actions';
import { ChatReplay, ReplayEvent, ReplayPayload } from '@app/interfaces/replay-actions';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject } from 'rxjs';
import { EventQueue } from './event-queue';

@Injectable({
    providedIn: 'root',
})
export class Replay2Service {
    isReplaying: boolean = false;
    queue: EventQueue = new EventQueue();
    startingTime: Date;
    state: ReplayState = ReplayState.STOPPED;
    stateSubject: BehaviorSubject<ReplayState> = new BehaviorSubject<ReplayState>(this.state);
    stateSubject$ = this.stateSubject.asObservable();
    previousEvent: ReplayEvent = { timestamp: 0 } as ReplayEvent;

    constructor(private socket: CommunicationSocketService) {}

    setSate(state: ReplayState) {
        this.state = state;
        this.stateSubject.next(this.state);
    }

    setStartingTime(time: Date) {
        this.startingTime = time;
        this.queue.startingTime = time;
    }

    playEvents(): void {
        const TRUE = 1;
        while (TRUE) {
            const event = this.queue.dequeue() as ReplayEvent;
            switch (this.state) {
                case ReplayState.PLAYING:
                    this.play(event);
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
            this.previousEvent = event;
        }
    }

    addEvent(action: ReplayActions, data?: ReplayPayload, playerName?: string): void {
        const event = {
            action,
            data,
            playerName,
            timestamp: this.getEventTime(),
        } as ReplayEvent;
        console.log(event);
        this.queue.enqueue(event);
    }

    backupQueue(): void {
        this.queue.backupQueue();
    }

    resetQueue(): void {
        this.queue.resetQueue();
    }

    private play(event: ReplayEvent) {
        switch (event.action) {
            case ReplayActions.CaptureMessage:
                this.replayMessage(event);
                break;
            case ReplayActions.DifferenceFoundUpdate:
                this.replayDifferenceFound(event);
                break;
            case ReplayActions.ClickError:
                this.replayError(event);
                break;
        }
    }

    private replayMessage(event: ReplayEvent, timeFactor: number = 1) {
        const messageSent = event.data as ChatReplay;
        const chatMessage = {
            content: messageSent.message,
            type: 'user',
        };

        setTimeout(() => {
            this.socket.send(SocketEvent.Message, { message: chatMessage, roomId: messageSent.roomId });
        }, this.timeSinceLastEvent(event) * timeFactor);
    }

    private replayDifferenceFound(event: ReplayEvent, timeFactor: number = 1) {
        setTimeout(() => {
            // this.differenceHandler.playCorrectSound();
        }, this.timeSinceLastEvent(event) * timeFactor);
    }

    private replayError(event: ReplayEvent, timeFactor: number = 1) {
        setTimeout(() => {
            // this.differenceHandler.playWrongSound();
        }, this.timeSinceLastEvent(event) * timeFactor);
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
