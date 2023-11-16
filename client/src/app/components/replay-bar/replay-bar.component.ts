import { Component, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { ReplayService, ReplayState } from '@app/services/replay-service/replay.service';

@Component({
    selector: 'app-replay-bar',
    templateUrl: './replay-bar.component.html',
    styleUrls: ['./replay-bar.component.scss'],
})
export class ReplayBarComponent implements OnChanges {
    currentSpeed = 1;
    isReplayAvailable: boolean = true;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    replaySpeeds = [0.5, 1, 2, 3];
    sliderPosition = 0;
    constructor(private readonly replayService: ReplayService, public dialog: MatDialog, private chat: ChatManagerService) {
        this.replayService.slider$.subscribe((ratio) => {
            this.sliderPosition = ratio;
        });
    }

    async ngOnChanges() {
        this.seekToEvent(this.sliderPosition);
    }

    async seekToEvent(percentage: number) {
        this.replayService.setSate(ReplayState.START);
        this.replayService.setCurrentTime(percentage);
        await this.replayService.playFromIndex(percentage);
    }

    async replay() {
        this.dialog.closeAll();
        await this.seekToEvent(0);
    }

    pause() {
        this.replayService.setSate(ReplayState.PAUSED);
    }

    async resume() {
        // this.replayService.setSate(ReplayState.PLAYING);
        // await this.replayService.playFromIndex(this.sliderPosition);
    }

    quit() {
        this.chat.leaveGameChat();
        this.replayService.setSate(ReplayState.DONE);
    }

    isReplaying(): boolean {
        return this.replayService.state === ReplayState.START;
    }

    isPaused(): boolean {
        return this.replayService.state === ReplayState.PAUSED;
    }

    setSpeed(speed: number) {
        this.currentSpeed = speed;
        this.replayService.setTimeFactor(this.currentSpeed);
    }

    totalEvents() {
        return this.replayService.length();
    }

    totalTime() {
        return this.replayService.getTotalSeconds();
    }
}
