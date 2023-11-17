import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { ReplayService } from '@app/services/replay-service/replay.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { UserService } from '@app/services/user-service/user.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-timer-stopwatch',
    templateUrl: './timer-stopwatch.component.html',
    styleUrls: ['./timer-stopwatch.component.scss'],
})
export class TimerStopwatchComponent implements OnInit, OnDestroy {
    timerDisplay: string;
    isGameDone = false;
    private time: number;
    private startTimer: number;

    // eslint-disable-next-line max-params
    constructor(
        private readonly socketService: CommunicationSocketService,
        private readonly timeFormatter: TimeFormatterService,
        private readonly gameInfoService: GameInformationHandlerService,
        private replayService: ReplayService,
        private readonly userService: UserService,
    ) {
        this.timerDisplay = this.timeFormatter.formatTime(this.time);
    }

    ngOnInit(): void {
        if (this.gameInfoService.timer !== 0) {
            this.socketService.send(SocketEvent.StartClock, { timer: this.gameInfoService.timer, roomId: this.gameInfoService.roomId });
        }
        this.socketService.on(SocketEvent.StartClock, (payload: { timer: number }) => {
            this.startTimer = payload.timer;
        });

        this.socketService.on(SocketEvent.Clock, (time: number) => {
            this.time = time;
            this.timerDisplay = this.timeFormatter.formatTime(time);
        });

        this.socketService.once(SocketEvent.Win || SocketEvent.Lose, () => {
            if (this.gameInfoService.timer !== 0) {
                this.userService.updateTotalTimePlayed(this.gameInfoService.timer - this.time);
            } else {
                this.userService.updateTotalTimePlayed(this.startTimer - this.time);
            }
            this.gameInfoService.endedTime = this.time;
            this.isGameDone = true;
            this.replayService.currentTime = this.time;
        });
    }

    isReplaying() {
        return this.replayService.isPlaying;
    }

    isReplayMode() {
        return this.replayService.isReplayMode;
    }

    getTimerDisplay() {
        return this.timerDisplay;
    }

    getTimeFromReplay() {
        return this.replayService.getFormattedTime();
    }

    needFeedbackAnimation() {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- animation when 5 seconds is left to the game
        return this.gameInfoService.isLimitedTime() && this.time <= 5;
    }

    ngOnDestroy(): void {
        this.socketService.off(SocketEvent.Clock);
    }
}
