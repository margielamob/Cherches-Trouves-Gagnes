import { Injectable, OnDestroy } from '@angular/core';
import { REPLAY_LIMITER, SPEED_X1 } from '@app/constants/replay';
import { ReplayActions } from '@app/enums/replay-actions';
import { ReplayEvent, ReplayPayload } from '@app/interfaces/replay-actions';
import { ReplayInterval } from '@app/interfaces/replay-interval';
import { CaptureService } from '@app/services/capture-service/capture.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { PublicGameInformation } from '@common/game-information';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { SocketEvent } from '@common/socket-event';
import { ChatMessage } from '@app/interfaces/chat-message';

@Injectable({
    providedIn: 'root',
})
export class ReplayService implements OnDestroy {
    isReplaying: boolean = false;
    private replayEvents: ReplayEvent[];
    private replaySpeed: number;
    // private currentCoords: Coordinate[];
    private isCheatModeActivated: boolean;
    private isDifferenceFound: boolean;
    private replayInterval: ReplayInterval;
    private currentReplayIndex: number;
    private replayTimer: BehaviorSubject<number>;
    private replayDifferenceFound: BehaviorSubject<number>;
    private replayOpponentDifferenceFound: BehaviorSubject<number>;
    private replayEventsSubjectSubscription: Subscription;

    constructor(
        private readonly captureService: CaptureService,
        private readonly gameInfoService: GameInformationHandlerService,
        private readonly differenceHandlerService: DifferencesDetectionHandlerService,
        private readonly communicationSocket: CommunicationSocketService,
    ) {
        this.addReplayEvent();
        this.isReplaying = false;
        this.replayTimer = new BehaviorSubject<number>(0);
        this.replayDifferenceFound = new BehaviorSubject<number>(0);
        this.replayOpponentDifferenceFound = new BehaviorSubject<number>(0);
        this.replayEvents = [];
        this.replaySpeed = SPEED_X1;
        // this.currentCoords = [];
        this.isCheatModeActivated = false;
        this.isDifferenceFound = false;
        this.currentReplayIndex = 0;
    }
    get replayTimer$() {
        return this.replayTimer.asObservable();
    }

    get replayDifferenceFound$() {
        return this.replayDifferenceFound.asObservable();
    }

    get replayOpponentDifferenceFound$() {
        return this.replayOpponentDifferenceFound.asObservable();
    }

    startReplay(): void {
        this.isReplaying = true;
        this.currentReplayIndex = 0;
        console.log(this.replayEvents, 'replay events');
        this.replayInterval = this.createReplayInterval(
            () => this.replaySwitcher(this.replayEvents[this.currentReplayIndex]),
            () => this.getNextInterval(),
        );
        this.replayInterval.start();
    }

    restartReplay(): void {
        this.currentReplayIndex = 0;
        this.replayInterval.resume();
    }

    pauseReplay(): void {
        this.toggleFlashing();
        this.replayInterval.pause();
    }
    resumeReplay(): void {
        this.toggleFlashing();
        this.replayInterval.resume();
    }

    upSpeed(speed: number): void {
        this.replaySpeed = speed;
        if (this.isCheatModeActivated) {
            // this.gameAreaService.toggleCheatMode(this.currentCoords, this.replaySpeed);
            // this.gameAreaService.toggleCheatMode(this.currentCoords, this.replaySpeed);
        }
    }

    restartTimer(): void {
        this.replayOpponentDifferenceFound.next(0);
        this.replayDifferenceFound.next(0);
        this.replayTimer.next(0);
    }

    resetReplay(): void {
        this.replaySpeed = SPEED_X1;
        this.replayEvents = [];
        this.currentReplayIndex = 0;
        this.isReplaying = false;
    }

    ngOnDestroy(): void {
        this.replayEventsSubjectSubscription?.unsubscribe();
    }

    private addReplayEvent(): void {
        this.replayEventsSubjectSubscription = this.captureService.replayEventsSubject$.subscribe((replayEvent: ReplayEvent) => {
            if (!this.isReplaying) this.replayEvents.push(replayEvent);
        });
    }

    private toggleFlashing(): void {
        if (this.isCheatModeActivated) {
            // this.cheatService.startCheatMode(this.currentCoords, this.replaySpeed);
        }
        if (this.isDifferenceFound) {
            // this.gameAreaService.flashPixels(this.currentCoords, this.replaySpeed, isPaused);
        }
    }
    private replaySwitcher(replayData: ReplayEvent): void {
        switch (replayData.action) {
            case ReplayActions.StartGame:
                this.replayGameStart(replayData.data as ReplayPayload);
                break;
            case ReplayActions.ClickFound:
                this.replayClickFound();
                break;
            case ReplayActions.ClickError:
                this.replayClickError();
                break;
            case ReplayActions.CaptureMessage:
                this.replayCaptureMessage(replayData.data as ReplayPayload);
                break;
            case ReplayActions.ActivateCheat:
                this.replayActivateCheat();
                break;
            case ReplayActions.DeactivateCheat:
                this.replayDeactivateCheat();
                break;
            case ReplayActions.TimerUpdate:
                this.replayTimerUpdate(replayData.data as ReplayPayload);
                break;
            case ReplayActions.DifferenceFoundUpdate:
                this.replayDifferenceFoundUpdate(replayData.data as ReplayPayload);
                break;
            case ReplayActions.OpponentDifferencesFoundUpdate:
                this.replayOpponentDifferencesFoundUpdate(replayData.data as ReplayPayload);
                break;
            case ReplayActions.UseHint:
                this.replayUseHint();
                break;
            case ReplayActions.ActivateThirdHint:
                this.replayActivateThirdHint();
                break;
            case ReplayActions.DeactivateThirdHint:
                this.replayDeactivateThirdHint();
                break;
        }
        this.currentReplayIndex++;
    }

    private createReplayInterval(callback: () => void, getNextInterval: () => number): ReplayInterval {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let remainingTime: number;
        let startTime: number;

        const start = (delay: number = 0) => {
            if (this.currentReplayIndex < this.replayEvents.length) {
                startTime = Date.now();
                remainingTime = !delay ? getNextInterval() : delay;

                if (!delay) {
                    callback();
                }

                timeoutId = setTimeout(() => {
                    start();
                }, remainingTime);
            } else {
                this.cancelReplay();
            }
        };

        const pause = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                remainingTime -= Date.now() - startTime;
                timeoutId = null;
            }
        };

        const resume = () => {
            if (!timeoutId) {
                start(remainingTime);
            }
        };

        const cancel = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            this.isReplaying = false;
        };

        return { start, pause, resume, cancel };
    }

    private cancelReplay(): void {
        this.replayInterval.cancel();
        this.currentReplayIndex = 0;
    }

    private getNextInterval(): number {
        const nextActionIndex = this.currentReplayIndex + 1;
        this.isDifferenceFound = false;
        return nextActionIndex < this.replayEvents.length
            ? (this.replayEvents[nextActionIndex].timestamp - this.replayEvents[this.currentReplayIndex].timestamp) / this.replaySpeed
            : REPLAY_LIMITER;
    }

    private replayGameStart(replayData: ReplayPayload): void {
        console.log(replayData, 'replay game start ');
        this.gameInfoService.setGameInformation(replayData as PublicGameInformation);
        // this.hintService.resetHints();
        // this.gameManager.differences = (replayData as GameRoom).originalDifferences;
        // this.imageService.loadImage(this.gameAreaService.getOriginalContext(), (replayData as GameRoom).clientGame.original);
        // this.imageService.loadImage(this.gameAreaService.getModifiedContext(), (replayData as GameRoom).clientGame.modified);
        // this.gameAreaService.setAllData();
    }

    private replayClickFound(): void {
        // this.currentCoords = replayData as Coordinate[];
        this.isDifferenceFound = true;
        this.differenceHandlerService.playCorrectSound();
        console.log('replay click found');
        // this.gameAreaService.setAllData();
        // this.gameAreaService.replaceDifference(replayData as Coordinate[], this.replaySpeed);
    }

    private replayClickError(): void {
        this.differenceHandlerService.playWrongSound();
        // this.gameAreaService.showError(
        //     (replayData as ClickErrorData).isMainCanvas as boolean,
        //     (replayData as ClickErrorData).pos as Coordinate,
        //     this.replaySpeed,
        // );
    }

    private replayCaptureMessage(replayData: ReplayPayload): void {
        const messageSent = replayData as ChatMessage;
        this.communicationSocket.send(SocketEvent.Message, { message: messageSent, roomId: this.gameInfoService.roomId });
    }

    private replayActivateCheat(): void {
        // this.isCheatMode = true;
        // this.currentCoords = replayData as Coordinate[];
        // this.gameAreaService.toggleCheatMode(replayData as Coordinate[], this.replaySpeed);
    }

    private replayDeactivateCheat(): void {
        // this.isCheatMode = false;
        // this.gameAreaService.toggleCheatMode(replayData as Coordinate[], this.replaySpeed);
    }

    private replayTimerUpdate(replayData: ReplayPayload): void {
        this.replayTimer.next(replayData as number);
    }

    private replayDifferenceFoundUpdate(replayData: ReplayPayload): void {
        this.replayDifferenceFound.next(replayData as number);
    }

    private replayOpponentDifferencesFoundUpdate(replayData: ReplayPayload): void {
        this.replayOpponentDifferenceFound.next(replayData as number);
    }

    private replayUseHint(): void {
        // this.hintService.requestHint(replayData as Coordinate[], this.replaySpeed);
    }

    private replayActivateThirdHint(): void {
        // this.hintService.switchProximity(replayData as number);
    }

    private replayDeactivateThirdHint(): void {
        // this.hintService.deactivateThirdHint();
    }
}
