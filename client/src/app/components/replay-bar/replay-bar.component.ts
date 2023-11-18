import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatManagerService } from '@app/services/chat-service/chat-manager.service';
import { REPLAY_SPEEDS } from '@app/services/replay-service/replay-interfaces';
import { ReplayService } from '@app/services/replay-service/replay.service';

@Component({
    selector: 'app-replay-bar',
    templateUrl: './replay-bar.component.html',
    styleUrls: ['./replay-bar.component.scss'],
})
export class ReplayBarComponent implements OnInit, OnDestroy {
    currentSpeed = 1;
    isReplayAvailable: boolean = true;
    replaySpeeds = REPLAY_SPEEDS;
    sliderPosition = 0;
    isPaused = true;
    constructor(private readonly replayService: ReplayService, public dialog: MatDialog, private chat: ChatManagerService) {
        this.replayService.newSlider$.subscribe((value) => {
            this.sliderPosition = value;
        });
    }

    ngOnInit(): void {
        this.sliderPosition = 0;
    }

    updateImages(percentage: number) {
        this.replayService.stopBlinking();
        const time = this.replayService.findInstant(percentage);
        this.replayService.updateImagesState(time);
    }

    seekToEvent(percentage: number) {
        if (!this.isPaused) {
            this.replayService.isPlaying = true;
        }
        this.replayService.play(percentage);
        this.updateImages(percentage);
    }

    replay() {
        this.isPaused = false;
        this.replayService.isPlaying = true;
        this.dialog.closeAll();
        this.seekToEvent(0);
    }

    canPause() {
        return this.sliderPosition !== 1;
    }

    pause() {
        this.isPaused = true;
        this.replayService.isPlaying = false;
    }

    resume() {
        this.isPaused = false;
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

    ngOnDestroy(): void {
        this.replayService.clear();
        this.replayService.isPlaying = false;
        this.sliderPosition = 0;
    }
}
