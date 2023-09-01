import { Component, Input, OnInit } from '@angular/core';
import { defaultScores } from '@app/constants/default-scores';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';
import { Score } from '@common/score';

@Component({
    selector: 'app-game-score',
    templateUrl: './game-score.component.html',
    styleUrls: ['./game-score.component.scss'],
})
export class GameScoreComponent implements OnInit {
    @Input() scores: Score[];
    @Input() title: string;
    @Input() isMultiplayer: boolean;

    constructor(private readonly timeFormatter: TimeFormatterService) {}

    ngOnInit(): void {
        this.validateScores();
    }

    formatScoreTime(scoreTime: number): string {
        return this.timeFormatter.formatTime(scoreTime);
    }

    private validateScores(): void {
        if (this.scores.length < 3) {
            this.scores.push(...defaultScores);
        }
        this.scores.splice(3);
    }
}
