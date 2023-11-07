import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-timer-stopwatch',
    templateUrl: './timer-stopwatch.component.html',
    styleUrls: ['./timer-stopwatch.component.scss'],
})
export class TimerStopwatchComponent implements OnInit, OnDestroy {
    timerDisplay: string;
    private time: number;

    constructor(
        private readonly socketService: CommunicationSocketService,
        private readonly timeFormatter: TimeFormatterService,
        private readonly gameInfoService: GameInformationHandlerService,
    ) {
        this.timerDisplay = this.gameInfoService.isClassic()
            ? this.timeFormatter.formatTime(0)
            : this.timeFormatter.formatTime(this.gameInfoService.gameTimeConstants.gameTime);
    }

    ngOnInit(): void {
        this.socketService.on(SocketEvent.Clock, (time: number) => {
            this.time = time;
            this.timerDisplay = this.timeFormatter.formatTime(time);
        });
    }

    needFeedbackAnimation() {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- animation when 5 seconds is left to the game
        return this.gameInfoService.isLimitedTime() && this.time <= 5;
    }

    ngOnDestroy(): void {
        this.socketService.off(SocketEvent.Clock);
    }
}
