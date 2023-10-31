import { Component, OnInit } from '@angular/core';
import { Theme } from '@app/enums/theme';
import { JoinableGameService } from '@app/services/joinable-game/joinable-game.service';
@Component({
    selector: 'app-join-game-selection',
    templateUrl: './join-game-selection.component.html',
    styleUrls: ['./join-game-selection.component.scss'],
})
export class JoinGameSelectionComponent implements OnInit {
    favoriteTheme: string = Theme.ClassName;
    joinableGames = this.joinableGameService.joinableGames.value;

    constructor(private joinableGameService: JoinableGameService) {}
    ngOnInit() {
        this.joinableGameService.joinableGames.subscribe((games) => {
            this.joinableGames = games;
        });
    }
}
