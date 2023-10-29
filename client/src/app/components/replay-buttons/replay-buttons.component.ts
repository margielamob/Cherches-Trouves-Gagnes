import { Component, Input, OnInit } from '@angular/core';
import { REPLAY_SPEEDS, SPEED_X1 } from '@app/constants/replay';
import { ReplayService } from '@app/services/replay-service/replay.service';

@Component({
    selector: 'app-replay-buttons',
    templateUrl: './replay-buttons.component.html',
    styleUrls: ['./replay-buttons.component.scss'],
})
export class ReplayButtonsComponent implements OnInit {
    @Input() isReplayAvailable: boolean;
    isReplayButtonDisabled: boolean;
    isReplayPaused: boolean;
    replaySpeeds: number[];
    replaySpeed: number;
    constructor(private readonly replayService: ReplayService) {
        this.isReplayAvailable = false;
        this.isReplayPaused = false;
        this.replaySpeeds = REPLAY_SPEEDS;
    }

    ngOnInit() {
        this.replaySpeed = SPEED_X1;
    }

    replay(isMidReplay: boolean) {
        if (isMidReplay) {
            // this.replayService.restartReplay();
        } else {
            // this.replayService.startReplay();
        }
        // this.replayService.restartTimer();
        // this.isReplayPaused = false;
        // this.isReplayButtonDisabled = true;
        // setTimeout(() => {
        //     this.isReplayButtonDisabled = false;
        // }, WAITING_TIME);
    }

    pause() {
        this.isReplayPaused = !this.isReplayPaused;
        // this.replayService.pauseReplay();
    }

    resume() {
        this.isReplayPaused = !this.isReplayPaused;
        // this.replayService.resumeReplay();
    }

    quit() {
        // this.replayService.resetReplay();
    }

    isReplaying(): boolean {
        return this.replayService.isReplaying;
    }

    setSpeed() {
        // this.replayService.upSpeed(speed);
    }
}
