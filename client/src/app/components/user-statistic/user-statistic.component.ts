import { Component, OnInit } from '@angular/core';
import { UserData } from '@app/interfaces/user';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { UserService } from '@app/services/user-service/user.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-user-statistic',
    templateUrl: './user-statistic.component.html',
    styleUrls: ['./user-statistic.component.scss'],
})
export class UserStatisticComponent implements OnInit {
    currentUserId: string | undefined;
    userAvatar: string | undefined;
    user$: Observable<UserData | undefined>;
    averageTimePlayedByGame: string | undefined;
    averageDiffFoundByGame: number | undefined;

    constructor(private userService: UserService, private timeFormatterService: TimeFormatterService) {}

    ngOnInit(): void {
        this.user$ = this.userService.getCurrentUser();
        this.user$.subscribe((user) => {
            this.currentUserId = user?.uid;
            if (user?.gamePlayed !== (undefined || 0)) {
                if (user?.numberDifferenceFound !== undefined)
                    this.averageDiffFoundByGame = Math.round(user.numberDifferenceFound / user?.gamePlayed);
                if (user?.totalTimePlayed !== undefined) {
                    this.averageTimePlayedByGame = this.timeFormatterService.formatTimeForScore(Math.round(user.totalTimePlayed / user.gamePlayed));
                }
            } else {
                this.averageDiffFoundByGame = 0;
                this.averageTimePlayedByGame = '00:00';
            }
        });
    }
}
