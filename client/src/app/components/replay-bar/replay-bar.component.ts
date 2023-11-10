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
    constructor(private readonly replayService: ReplayService, public dialog: MatDialog, private chat: ChatManagerService) {}

    get sliderPosition() {
        return this.replayService.getCurrentIndex();
    }

    set sliderPosition(pos: number) {
        this.replayService.setCurrentIndex(pos);
    }

    ngOnChanges() {
        this.seekToEvent(this.sliderPosition);
    }

    async seekToEvent(position: number) {
        this.replayService.setSate(ReplayState.START);
        this.replayService.setCurrentTime(position);
        await this.replayService.playFromIndex(position);
    }

    async replay() {
        this.dialog.closeAll();
        await this.seekToEvent(0);
    }

    pause() {
        this.replayService.setSate(ReplayState.PAUSED);
    }

    async resume() {
        this.replayService.setSate(ReplayState.PLAYING);
        await this.replayService.playFromIndex(this.sliderPosition);
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
}
