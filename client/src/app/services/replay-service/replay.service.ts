/* eslint-disable max-lines */
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
import { BehaviorSubject, Subject } from 'rxjs';
import { EventArray } from './event-array';
import { DifferenceFound, DifferenceNotFound, ReplayEvent, ReplayPayload } from './replay-interfaces';

@Injectable({
    providedIn: 'root',
})
export class ReplayService {
    // subscriptions:
    loadImages = new BehaviorSubject<boolean>(false);
    loadImages$ = this.loadImages.asObservable();
    cheatActivated = new BehaviorSubject<boolean>(false);
    cheatActivated$ = this.cheatActivated.asObservable();
    // public props
    state: ReplayState = ReplayState.STOPPED;
    gameId: string;

    // Node.Js Timers
    timerRef: any;
    sliderRef: any;
    leftIntervalRef: any;
    rightIntervalRef: any;
    differencesContext: CanvasRenderingContext2D;
    imgOriginalContext: CanvasRenderingContext2D;
    // event subject
    private stopPlayingSubject: Subject<void> = new Subject<void>();
    // private props
    private array: EventArray = new EventArray();
    private previousEvent: ReplayEvent;
    private timeFactor: number = 1;
    private originalContext: CanvasRenderingContext2D;
    private modifiedContext: CanvasRenderingContext2D;
    private imgModifiedContext: CanvasRenderingContext2D;

    private currentTime: number;
    private timer: number;
    private gameImageState: Map<number, ImageData> = new Map();
    private size = 0;

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

    stopPlaying() {
        this.stopPlayingSubject.next();
    }

    setCurrentTime(percentage: number) {
        const index = this.indexFromPercentage(percentage);
        if (index === this.length()) {
            this.currentTime = this.gameHandler.endedTime;
            return;
        }
        if (this.timerRef) {
            this.clearTimer();
        }
        const factor = this.getElapsedSeconds(this.array.getEvent(index));
        const time = this.timer - factor;

        this.setTimer(time);
    }

    setTimer(time: number) {
        this.currentTime = time;
        this.timerRef = setInterval(() => {
            this.currentTime--;
            if (this.currentTime <= this.gameHandler.endedTime) {
                clearInterval(this.timerRef);
            }
        }, 1000 / this.timeFactor);
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

        this.saveGameState(this.size);

        this.array.push(event);
        this.size++;
    }

    pause() {
        this.state = ReplayState.PAUSED;
    }

    resume() {
        this.state = ReplayState.PLAYING;
    }

    saveGameState(idx: number) {
        const imageData = this.imgModifiedContext.getImageData(0, 0, this.imgModifiedContext.canvas.width, this.modifiedContext.canvas.height);
        this.gameImageState.set(idx, imageData);
    }

    async updateImage(index: number) {
        return new Promise<void>((resolve, reject) => {
            console.log(this.gameImageState.size);
            if (index === 0) {
                resolve();
            }

            const imageData = this.gameImageState.get(index - 1);

            if (!imageData) {
                reject();
            } else {
                this.modifiedContext.putImageData(imageData, 0, 0);
                resolve();
            }
        });
    }

    getFormattedTime() {
        return this.timeFormatter.formatTime(this.currentTime);
    }

    getTotalSeconds() {
        return this.array.getTotalSeconds();
    }

    indexFromPercentage(percentage: number) {
        return Math.floor(percentage * this.length());
    }

    async playFromIndex(percentage: number = this.array.currentIndex) {
        this.array.currentIndex = this.indexFromPercentage(percentage);

        while (this.state !== ReplayState.DONE) {
            if (this.array.end()) {
                this.setSate(ReplayState.DONE);
                return;
            }

            await this.updateImage(this.array.currentIndex);

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

    private replayStartGame() {
        this.sendReplayToServer();
        this.loadImages.next(true);
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
        return new Promise<void>((resolve) => {
            const timeoutId = setTimeout(() => {
                if (this.state === ReplayState.PLAYING) {
                    resolve();
                } else {
                    clearTimeout(timeoutId);
                }
            }, ms);
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
