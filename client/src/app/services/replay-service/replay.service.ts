/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { EventArray } from './event-array';
import { DifferenceFound, DifferenceNotFound, ReplayEvent, ReplayPayload } from './replay-interfaces';

@Injectable({
    providedIn: 'root',
})
export class ReplayService {
    // subscriptions:
    newSlider = new BehaviorSubject<number>(0);
    newSlider$ = this.newSlider.asObservable();
    loadImages = new BehaviorSubject<boolean>(false);
    loadImages$ = this.loadImages.asObservable();
    cheatActivated = new BehaviorSubject<boolean>(false);
    cheatActivated$ = this.cheatActivated.asObservable();
    isGameDone = false;
    // public props
    gameId: string;

    // Node.Js Timers
    timerRef: any;
    leftIntervalRef: any;
    rightIntervalRef: any;
    sliderIntervalRef: any;
    differencesContext: CanvasRenderingContext2D;
    imgOriginalContext: CanvasRenderingContext2D;
    // event subject
    // private props
    isPlaying = false;
    isReplayMode = false;
    currentTime: number;
    endTime: number;
    sliderValue = 0;
    private array: EventArray = new EventArray();
    private timeFactor: number = 1;
    private originalContext: CanvasRenderingContext2D;
    private modifiedContext: CanvasRenderingContext2D;
    private imgModifiedContext: CanvasRenderingContext2D;

    private startingTime: number;
    private rightImageState: Map<number, ImageData> = new Map();
    private leftImageState: Map<number, ImageData> = new Map();
    private players: { name: string; nbDifference: string }[] = [];
    private playersInfoState: Map<number, { name: string; nbDifference: string }[]> = new Map();

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

    getPlayers() {
        return this.players;
    }

    setPlayerInfos(players: { name: string; nbDifference: string }[]) {
        this.players = players;
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
        return this.startingTime - Math.round(this.getTotalSeconds() * percentage);
    }

    timesUp() {
        console.log(this.endTime);
        return this.currentTime <= this.endTime;
    }

    clear() {
        this.array.clear();
    }

    play(percentage: number) {
        const time = this.findInstant(percentage);

        if (this.timerRef) {
            this.clearTimer();
        }

        if (this.sliderIntervalRef) {
            clearInterval(this.sliderIntervalRef);
        }

        this.setTimer(time);
        this.sendSlider(percentage);
    }

    setTimer(time: number) {
        this.currentTime = time;
        this.timerRef = setInterval(() => {
            this.updatePlayersInfo(this.currentTime);
            if (!this.isPlaying) {
                clearInterval(this.timerRef);
                return;
            }
            const events = this.getEventFromInstant(this.currentTime);
            if (events.length > 0) {
                for (const event of events) {
                    this.playEvent(event);
                }
            }
            if (this.timesUp()) {
                this.playLastEvents();
                this.newSlider.next(1);
                clearInterval(this.timerRef);
                return;
            }
            this.currentTime--;
        }, 1000 / this.timeFactor);
    }

    sendSlider(fromValue: number) {
        this.setSliderValue(fromValue);
        this.emitSliderValue();
    }

    setSliderValue(value: number) {
        this.sliderValue = value;
    }

    playLastEvents() {
        const events = this.getEventFromInstant(this.endTime);
        if (events.length > 0) {
            for (const event of events) {
                this.playEvent(event);
            }
        }
    }

    displayLastInstant() {
        this.updateImagesState(this.endTime);
    }

    emitSliderValue() {
        const intervalTime = 100;
        this.sliderIntervalRef = setInterval(() => {
            if (this.sliderValue >= 1 || !this.isPlaying) {
                if (this.sliderValue >= 1) {
                    this.newSlider.next(1);
                }
                clearInterval(this.sliderIntervalRef);
                return;
            }
            this.newSlider.next(this.sliderValue);
            this.sliderValue += intervalTime / (((this.getTotalSeconds() + 1) / this.timeFactor) * 1000);
        }, intervalTime);
    }

    getEventInstant(event: ReplayEvent) {
        const elapsedTime = this.getElapsedSeconds(event);
        return this.startingTime - elapsedTime;
    }

    isEventOnInstant(event: ReplayEvent, instant: number) {
        return this.getEventInstant(event) === instant;
    }

    getEventFromInstant(instant: number) {
        const events = [];
        for (let i = 0; i < this.length(); i++) {
            if (this.isEventOnInstant(this.array.getEvent(i), instant)) {
                events.push(this.array.getEvent(i));
            }
        }

        return events;
    }

    addEvent(action: ReplayActions, data?: ReplayPayload, playerName?: string): void {
        const event = {
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

    saveImagesState(time: number) {
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

    updateGameState(time: number) {
        this.updateImagesState(time);
    }

    updatePlayersInfo(time: number) {
        if (time === this.startingTime) {
            time = this.startingTime - 1;
        }
        const foundInfos = this.playersInfoState.get(time);
        if (foundInfos) {
            this.players = foundInfos;
        }
    }

    getFormattedTime() {
        return this.timeFormatter.formatTime(this.currentTime);
    }

    getElapsedSeconds(event: ReplayEvent) {
        return Math.round((event.timestamp - this.array.getEvent(0).timestamp) / 1000);
    }

    getTotalSeconds() {
        return this.array.getTotalSeconds();
    }

    playEvent(event: ReplayEvent) {
        // this.stopBlinking();
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

        this.socket.on(SocketEvent.EndedTime, (payload: { time: number }) => {
            console.log('received end time');
            this.endTime = payload.time;
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
            this.currentTime = time;
            this.saveImagesState(time);
            this.saveScoreInstant();
        });
    }

    private updateImagesState(time: number) {
        if (time < this.endTime) {
            time = this.endTime;
        }

        if (time === this.startingTime) {
            time = this.startingTime - 1;
        }
        const rightImageData = this.rightImageState.get(time);
        const leftImageData = this.leftImageState.get(time);

        if (!rightImageData || !leftImageData) {
            return;
        } else {
            this.modifiedContext.putImageData(rightImageData, 0, 0);
            this.originalContext.putImageData(leftImageData, 0, 0);
        }
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

    private saveScoreInstant() {
        const time = this.currentTime;
        const newArray = _.cloneDeep(this.players);
        this.playersInfoState.set(time, newArray);
    }
}

export enum ReplayActions {
    StartGame = 'StartGame',
    ClickError = 'ClickError',
    ActivateCheat = 'ActivateCheat',
    ClickFound = 'ClickFound',
}
