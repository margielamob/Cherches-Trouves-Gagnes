import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Replay2Service, ReplayState } from '@app/services/replay-service/replay2.service';

@Component({
    selector: 'app-replay-buttons',
    templateUrl: './replay-buttons.component.html',
    styleUrls: ['./replay-buttons.component.scss'],
})
export class ReplayButtonsComponent {
    isReplayAvailable: boolean = true;
    constructor(private readonly replayService: Replay2Service, public dialog: MatDialog) {}

    async replay() {
        this.dialog.closeAll();
        this.replayService.backupQueue();
        this.replayService.setSate(ReplayState.PLAYING);
        console.log(this.replayService.getQueue().length);
        await this.replayService.playEvents();
    }

    pause() {
        this.replayService.setSate(ReplayState.PAUSED);
    }

    resume() {
        this.replayService.setSate(ReplayState.PLAYING);
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
