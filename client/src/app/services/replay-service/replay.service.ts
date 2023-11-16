/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
import { BehaviorSubject } from 'rxjs';
import { EventArray } from './event-array';
import { DifferenceFound, DifferenceNotFound, ReplayEvent, ReplayPayload } from './replay-interfaces';

@Injectable({
    providedIn: 'root',
})
export class ReplayService {
    // subscriptions:
    hasReplayStarted = new BehaviorSubject<boolean>(false);
    hasReplayStarted$ = this.hasReplayStarted.asObservable();
    slider = new BehaviorSubject<number>(0);
    slider$ = this.slider.asObservable();
    imagesLoaded = new BehaviorSubject<boolean>(false);
    imagesLoaded$ = this.imagesLoaded.asObservable();
    cheatActivated = new BehaviorSubject<boolean>(false);
    cheatActivated$ = this.cheatActivated.asObservable();
    // public props
    state: ReplayState = ReplayState.STOPPED;
    gameId: string;
    differencesContext: CanvasRenderingContext2D;
    imgOriginalContext: CanvasRenderingContext2D;
    // Node.Js Timers
    timerRef: any;
    sliderRef: any;
    leftIntervalRef: any;
    rightIntervalRef: any;
    // private props
    private array: EventArray = new EventArray();
    private previousEvent: ReplayEvent;
    private timeFactor: number = 1;
    private originalContext: CanvasRenderingContext2D;
    private modifiedContext: CanvasRenderingContext2D;
    private imgModifiedContext: CanvasRenderingContext2D;
    private currentTime: number;
    private timer: number;
    private elapsed: number = 0;

    // eslint-disable-next-line max-params
    constructor(
        private socket: CommunicationSocketService,
        private differenceHandler: DifferencesDetectionHandlerService,
        private gameHandler: GameInformationHandlerService,
        private timeFormatter: TimeFormatterService,
    ) {}

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

    setCurrentTime(percentage: number) {
        this.stopBlinking();
        const index = this.indexFromPercentage(percentage);
        if (index === this.length()) {
            this.currentTime = this.gameHandler.endedTime;
            return;
        }
        if (this.timerRef) {
            this.clearTimer();
        }
        const factor = this.getElapsedSeconds(this.array.getEvent(index));
        this.elapsed = factor;
        const time = this.timer - factor;

        this.setTimer(time);
    }

    setTimer(time: number) {
        this.currentTime = time;
        this.timerRef = setInterval(() => {
            this.currentTime--;
            this.elapsed++;
            this.slider.next(this.getCurrentRatio());
            if (this.currentTime <= this.gameHandler.endedTime) {
                this.stopBlinking();
                clearInterval(this.timerRef);
                this.slider.next(1);
            }
        }, 1000 / this.timeFactor);
    }

    getCurrentRatio() {
        return this.elapsed / this.getTotalSeconds();
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

    getFormattedTime() {
        return this.timeFormatter.formatTime(this.currentTime);
    }

    timeToIndex(elapsedSeconds: number) {
        return Math.round(this.length() * (elapsedSeconds / this.getTotalSeconds()));
    }

    indexToTime() {
        return Math.round(this.getTotalSeconds() * (this.array.currentIndex / this.length()));
    }

    getTotalSeconds() {
        return this.array.getTotalSeconds();
    }

    eventPercentage() {
        return this.getElapsedSeconds(this.array.getCurrentEvent()) / this.getTotalSeconds();
    }

    indexFromPercentage(percentage: number) {
        return Math.round(percentage * this.length());
    }

    async playFromIndex(percentage: number = this.array.currentIndex) {
        this.array.currentIndex = this.indexFromPercentage(percentage);

        while (this.state !== ReplayState.DONE) {
            if (this.array.end()) {
                this.setSate(ReplayState.DONE);
                return;
            }

            const event = this.array.getCurrentEvent();
            await this.delay(this.timeSinceLastEvent(event) / this.timeFactor);
            switch (event.action) {
                case ReplayActions.DifferenceFoundUpdate:
                    this.replayDifferenceFound(event);
                    break;
                case ReplayActions.ClickError:
                    this.replayDifferenceNotFound(event);
                    break;
                case ReplayActions.StartGame:
                    this.replayStartGame();
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
            if (this.gameHandler.timer !== 0) {
                this.socket.send(SocketEvent.Timer, { timer: this.gameHandler.timer, roomId: this.gameId });
                this.timer = this.gameHandler.timer;
            }
        });

        this.socket.on(SocketEvent.Cheat, () => {
            this.addEvent(ReplayActions.ActivateCheat);
        });

        this.socket.on(SocketEvent.Timer, (payload: { timer: number }) => {
            this.timer = payload.timer;
        });
    }

    private clearTimer() {
        clearInterval(this.timerRef);
    }

    private stopBlinking() {
        if (this.rightIntervalRef && this.leftIntervalRef) {
            clearInterval(this.leftIntervalRef);
            clearInterval(this.rightIntervalRef);
        }
    }

    private replayStartGame() {
        this.sendReplayToServer();
        this.hasReplayStarted.next(true);
    }
    private replayDifferenceFound(event: ReplayEvent) {
        const data = event.data as DifferenceFound;
        this.leftIntervalRef = this.differenceHandler.differenceDetected(this.originalContext, this.imgModifiedContext, data.coords, this.timeFactor);
        this.rightIntervalRef = this.differenceHandler.differenceDetected(
            this.modifiedContext,
            this.imgModifiedContext,
            data.coords,
            this.timeFactor,
        );
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

    private sendReplayToServer() {
        this.socket.send(SocketEvent.ResetGameInfosReplay, { gameId: this.gameId });
    }

    private getElapsedSeconds(event: ReplayEvent) {
        return Math.floor((event.timestamp - this.array.getEvent(0).timestamp) / 1000);
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
