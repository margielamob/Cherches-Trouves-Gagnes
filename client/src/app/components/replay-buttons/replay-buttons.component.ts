import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReplayService, ReplayState } from '@app/services/replay-service/replay.service';

@Component({
    selector: 'app-replay-buttons',
    templateUrl: './replay-buttons.component.html',
    styleUrls: ['./replay-buttons.component.scss'],
})
export class ReplayButtonsComponent {
    currentSpeed = 1;
    isReplayAvailable: boolean = true;
    replaySpeeds = [0.5, 1, 2, 3];
    constructor(private readonly replayService: ReplayService, public dialog: MatDialog) {}

    async replay() {
        this.dialog.closeAll();
        this.replayService.backupQueue();
        this.replayService.resetQueue();
        this.replayService.setSate(ReplayState.PLAYING);
        // eslint-disable-next-line deprecation/deprecation
        await this.replayService.playEvents();
    }

    pause() {
        this.replayService.setSate(ReplayState.PAUSED);
    }

    async resume() {
        this.replayService.setSate(ReplayState.PLAYING);
        await this.replayService.playEvents();
    }

    quit() {
        this.replayService.setSate(ReplayState.STOPPED);
    }

    isReplaying(): boolean {
        return this.replayService.state === ReplayState.PLAYING;
    }

    isPaused(): boolean {
        return this.replayService.state === ReplayState.PAUSED;
    }

    setSpeed(speed: number) {
        this.currentSpeed = speed;
        this.replayService.setTimeFactor(this.currentSpeed);
    }
}
