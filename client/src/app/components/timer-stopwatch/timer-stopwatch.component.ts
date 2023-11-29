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
    totalBonusTime = 0;
    endTime = 0;
    private time: number;

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

        if (this.gameInfoService.gameMode === 'Temps Limité' && this.gameInfoService.startTimer !== (0 || undefined)) {
            this.socketService.send(SocketEvent.StartLimitedClock, {
                timer: this.gameInfoService.startTimer,
                roomId: this.gameInfoService.roomId,
            });
        }

        this.socketService.on(SocketEvent.Clock, (time: number) => {
            this.time = time;
            this.timerDisplay = this.timeFormatter.formatTime(time);
            this.gameInfoService.emailTimer = time;
        });

        this.socketService.once(SocketEvent.Win || SocketEvent.Lose, () => {
            this.gameInfoService.endedTime = this.time;
            this.replayService.endTime = this.time;
            this.isGameDone = true;
            this.replayService.currentTime = this.time;
        });

        this.socketService.on(SocketEvent.TimerBonus, (obj: { bonus: number }) => {
            this.totalBonusTime += obj.bonus;
        });

        this.socketService.on(SocketEvent.EndedTime, (payload: { time: number }) => {
            this.endTime = payload.time;
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
        if (this.gameInfoService.getGameMode() === 'Classique') {
            if (this.gameInfoService.timer !== 0) {
                this.userService.updateTotalTimePlayed(this.gameInfoService.timer - this.time);
            } else {
                this.userService.updateTotalTimePlayed(this.gameInfoService.startTimer - this.time);
            }
        } else if (this.gameInfoService.getGameMode() === 'Temps Limité') {
            const totalTimePlayed = this.gameInfoService.startTimer - this.time + this.totalBonusTime;
            this.userService.updateTotalTimePlayed(totalTimePlayed);
        }
        this.socketService.off(SocketEvent.Clock);
    }
}
