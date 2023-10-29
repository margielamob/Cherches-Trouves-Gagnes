import { Injectable, OnDestroy } from '@angular/core';
// import { SPEED_X1 } from '@app/constants/replay';
import { ReplayEvent } from '@app/interfaces/replay-actions';
// import { ReplayInterval } from '@app/interfaces/replay-interval';
import { CaptureService } from '@app/services/capture-service/capture.service';
// import { Coordinate } from '@common/coordinate';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReplayService implements OnDestroy {
    isReplaying: boolean = false;
    private replayEvents: ReplayEvent[];
    // private replaySpeed: number;
    // private currentCoords: Coordinate[];
    // private isCheatModeActivated: boolean;
    // private isDifferenceFound: boolean;
    // private replayInterval: ReplayInterval;
    // private currentReplayIndex: number;
    private replayTimer: BehaviorSubject<number>;
    private replayDifferenceFound: BehaviorSubject<number>;
    private replayOpponentDifferenceFound: BehaviorSubject<number>;
    private replayEventsSubjectSubscription: Subscription;

    constructor(private readonly captureService: CaptureService) {
        this.addReplayEvent();
        this.isReplaying = false;
        this.replayTimer = new BehaviorSubject<number>(0);
        this.replayDifferenceFound = new BehaviorSubject<number>(0);
        this.replayOpponentDifferenceFound = new BehaviorSubject<number>(0);
        this.replayEvents = [];
        // this.replaySpeed = SPEED_X1;
        // this.currentCoords = [];
        // this.isCheatModeActivated = false;
        // this.isDifferenceFound = false;
        // this.currentReplayIndex = 0;
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
        // this.currentReplayIndex = 0;
        // this.replayInterval = this.createReplayInterval(
        //     () => this.replaySwitcher(this.replayEvents[this.currentReplayIndex]),
        //     () => this.getNextInterval(),
        // );
        // this.replayInterval.start();
    }
    restartTimer(): void {
        this.replayOpponentDifferenceFound.next(0);
        this.replayDifferenceFound.next(0);
        this.replayTimer.next(0);
    }

    ngOnDestroy(): void {
        this.replayEventsSubjectSubscription?.unsubscribe();
    }

    private addReplayEvent(): void {
        this.replayEventsSubjectSubscription = this.captureService.replayEventsSubject$.subscribe((replayEvent: ReplayEvent) => {
            if (!this.isReplaying) this.replayEvents.push(replayEvent);
        });
    }
}
