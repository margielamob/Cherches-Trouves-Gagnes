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

    ngOnChanges() {
        this.replayService.isPlaying = true;
        this.seekToEvent(this.sliderPosition);
    }

    seekToEvent(percentage: number) {
        this.replayService.play(percentage);
    }

    replay() {
        this.replayService.isPlaying = true;
        this.dialog.closeAll();
        this.seekToEvent(0);
    }

    pause() {
        this.replayService.isPlaying = false;
    }

    resume() {
        this.replayService.isPlaying = true;
        this.seekToEvent(this.sliderPosition);
    }

    quit() {
        this.chat.leaveGameChat();
    }

    isReplaying(): boolean {
        return this.replayService.isPlaying;
    }

    setSpeed(speed: number) {
        this.currentSpeed = speed;
        this.replayService.setTimeFactor(this.currentSpeed);
    }

    totalTime() {
        return this.replayService.getTotalSeconds();
    }
}
