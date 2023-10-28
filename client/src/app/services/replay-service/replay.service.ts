import { Injectable, OnDestroy } from '@angular/core';
import { ReplayEvent } from '@app/interfaces/replay-actions';
import { ReplayInterval } from '@app/interfaces/replay-interval';
import { Coordinate } from '@common/coordinate';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReplayService implements OnDestroy {
    isReplaying: boolean = false;
    private replayEvents: ReplayEvent[];
    private replaySpeed: number;
    private currentCoords: Coordinate[];
    private isCheatMode: boolean;
    private isDifferenceFound: boolean;
    private replayInterval: ReplayInterval;
    private currentReplayIndex: number;
    private replayTimer: BehaviorSubject<number>;
    private replayDifferenceFound: BehaviorSubject<number>;
    private replayOpponentDifferenceFound: BehaviorSubject<number>;
    private replayEventsSubjectSubscription: Subscription;

    constructor() {}
}
