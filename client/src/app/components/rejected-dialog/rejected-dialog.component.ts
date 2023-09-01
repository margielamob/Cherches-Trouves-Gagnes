import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Theme } from '@app/enums/theme';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

@Component({
    selector: 'app-rejected-dialog',
    templateUrl: './rejected-dialog.component.html',
    styleUrls: ['./rejected-dialog.component.scss'],
})
export class RejectedDialogComponent {
    @Input() reason: string;
    favoriteTheme: string = Theme.ClassName;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            reason: string;
        },
        private readonly gameInfoService: GameInformationHandlerService,
    ) {
        this.reason = data.reason;
    }

    isClassic() {
        return this.gameInfoService.isClassic();
    }
}
