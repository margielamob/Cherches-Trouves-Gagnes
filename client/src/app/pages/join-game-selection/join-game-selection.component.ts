import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { JoinableGameService } from '@app/services/joinable-game/joinable-game.service';

@Component({
    selector: 'app-join-game-selection',
    templateUrl: './join-game-selection.component.html',
    styleUrls: ['./join-game-selection.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGameSelectionComponent implements OnInit {
    joinableClassicGames$ = this.joinableGameService.joinableClassicGames$;
    joinableLimitedGames$ = this.joinableGameService.joinableLimitedGames$;

    isClassic: boolean;
    constructor(public joinableGameService: JoinableGameService) {}

    ngOnInit(): void {
        this.isClassic = this.joinableGameService.isClassic;
        this.joinableGameService.fetchJoinableGames();
    }
}
