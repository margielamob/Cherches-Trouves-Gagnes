import { Component, Input } from '@angular/core';
import { Replay2Service, ReplayState } from '@app/services/replay-service/replay2.service';

@Component({
    selector: 'app-replay-buttons',
    templateUrl: './replay-buttons.component.html',
    styleUrls: ['./replay-buttons.component.scss'],
})
export class ReplayButtonsComponent {
    @Input() isReplayAvailable: boolean;
    constructor(private readonly replayService: Replay2Service) {}

    async replay() {
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
