import { Component, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { ReplayService } from '@app/services/replay-service/replay.service';

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
    constructor(private readonly replayService: ReplayService, public dialog: MatDialog, private chat: ChatManagerService) {}

    async ngOnChanges() {
        this.replayService.isPlaying = true;
        this.seekToEvent(this.sliderPosition);
    }

    async seekToEvent(percentage: number) {
        await this.replayService.play();
        this.replayService.setCurrentTime(percentage);
        // await this.replayService.playFromPercentage(percentage);
    }

    async replay() {
        await this.replayService.play();
        this.dialog.closeAll();
        await this.seekToEvent(0);
    }

    async pause() {
        await this.replayService.pause();
    }

    async resume() {
        await this.replayService.resume();
    }

    quit() {
        this.chat.leaveGameChat();
    }

    isReplaying(): boolean {
        return this.replayService.isPlaying;
    }

    isDone() {
        this.replayService.isDone();
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
