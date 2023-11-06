import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReplayService, ReplayState } from '@app/services/replay-service/replay.service';

@Component({
    selector: 'app-replay-buttons',
    templateUrl: './replay-buttons.component.html',
    styleUrls: ['./replay-buttons.component.scss'],
})
export class ReplayButtonsComponent {
    isReplayAvailable: boolean = true;
    constructor(private readonly replayService: ReplayService, public dialog: MatDialog) {}

    async replay() {
        this.dialog.closeAll();
        console.log(this.replayService.getQueueLength());
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
}
