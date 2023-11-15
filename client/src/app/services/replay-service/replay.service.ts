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
import { BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';
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
    gameId: string;

    // Node.Js Timers
    timerRef: any;
    sliderRef: any;
    leftIntervalRef: any;
    rightIntervalRef: any;
    differencesContext: CanvasRenderingContext2D;
    imgOriginalContext: CanvasRenderingContext2D;
    // event subject
    // private props
    isPlaying = false;
    private array: EventArray = new EventArray();
    private timeFactor: number = 1;
    private originalContext: CanvasRenderingContext2D;
    private modifiedContext: CanvasRenderingContext2D;
    private imgModifiedContext: CanvasRenderingContext2D;

    private currentTime: number;
    private startingTime: number;
    private rightImageState: Map<number, ImageData> = new Map();
    private leftImageState: Map<number, ImageData> = new Map();

    // private size = 0;

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

    setTimeFactor(factor: number) {
        this.timeFactor = factor;
    }

    getTimeFactor() {
        return this.timeFactor;
    }

    findInstant(percentage: number) {
        return Math.floor(this.startingTime - this.getTotalSeconds() * percentage);
    }

    play(percentage: number) {
        if (this.timerRef) {
            this.clearTimer();
        }
        const time = this.findInstant(percentage);

        console.log(time);
        this.setTimer(time);
    }

    setTimer(time: number) {
        this.currentTime = time;
        this.timerRef = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(this.timerRef);
                return;
            }
            const event = this.getEventFromInstant(this.currentTime);
            this.updateImagesState(this.currentTime);
            if (event) {
                this.playEvent(event);
            }
            this.currentTime--;

            console.log(this.currentTime);
            if (this.currentTime <= this.gameHandler.endedTime) {
                const endEvent = this.getEventFromInstant(this.currentTime);
                if (endEvent) {
                    this.playEvent(endEvent);
                }
                clearInterval(this.timerRef);
            }
        }, 1000 / this.timeFactor);
    }

    getEventInstant(event: ReplayEvent) {
        const elapsedTime = this.getElapsedSeconds(event);
        return this.startingTime - elapsedTime;
    }

    isEventOnInstant(event: ReplayEvent, instant: number) {
        return this.getEventInstant(event) === instant;
    }

    getEventFromInstant(instant: number) {
        for (let i = 0; i < this.length(); i++) {
            if (this.isEventOnInstant(this.array.getEvent(i), instant)) {
                return this.array.getEvent(i);
            }
        }

        return undefined;
    }

    addEvent(action: ReplayActions, data?: ReplayPayload, playerName?: string): void {
        const event = {
            eventId: this.generateId(),
            action,
            data,
            playerName,
            timestamp: Date.now(),
        } as ReplayEvent;
        this.array.push(event);
    }

    stopBlinking() {
        if (!this.leftIntervalRef || !this.rightIntervalRef) return;
        clearInterval(this.leftIntervalRef);
        clearInterval(this.rightIntervalRef);
    }

    saveGameState(time: number) {
        const rightImageData = this.imgModifiedContext.getImageData(
            0,
            0,
            this.imgModifiedContext.canvas.width,
            this.imgModifiedContext.canvas.height,
        );
        const leftImageData = this.imgOriginalContext.getImageData(0, 0, this.imgOriginalContext.canvas.width, this.imgOriginalContext.canvas.height);

        this.rightImageState.set(time, rightImageData);
        this.leftImageState.set(time, leftImageData);
    }

    updateImagesState(time: number) {
        const rightImageData = this.rightImageState.get(time);
        const leftImageData = this.leftImageState.get(time);

        if (!rightImageData || !leftImageData) {
            return;
        } else {
            this.modifiedContext.putImageData(rightImageData, 0, 0);
            this.originalContext.putImageData(leftImageData, 0, 0);
        }
    }

    getFormattedTime() {
        return this.timeFormatter.formatTime(this.currentTime);
    }

    getElapsedSeconds(event: ReplayEvent) {
        return Math.floor((event.timestamp - this.array.getEvent(0).timestamp) / 1000);
    }

    getTotalSeconds() {
        return this.array.getTotalSeconds();
    }

    playEvent(event: ReplayEvent) {
        console.log('in play event');
        this.stopBlinking();

        switch (event.action) {
            case ReplayActions.ClickFound:
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
                this.addEvent(ReplayActions.ClickFound, data);
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
                this.startingTime = this.gameHandler.timer;
            }
        });

        this.socket.on(SocketEvent.Cheat, () => {
            this.addEvent(ReplayActions.ActivateCheat);
        });

        this.socket.on(SocketEvent.Timer, (payload: { timer: number }) => {
            this.startingTime = payload.timer;
        });

        this.socket.on(SocketEvent.Clock, (time: number) => {
            this.saveGameState(time);
        });
    }

    private clearTimer() {
        clearInterval(this.timerRef);
    }

    private replayStartGame() {
        this.sendReplayToServer();
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

    private sendReplayToServer() {
        this.socket.send(SocketEvent.ResetGameInfosReplay, { gameId: this.gameId });
    }

    private generateId() {
        return v4();
    }
}

export enum ReplayActions {
    StartGame = 'StartGame',
    ClickError = 'ClickError',
    ActivateCheat = 'ActivateCheat',
    ClickFound = 'ClickFound',
}
