import { Component, OnInit } from '@angular/core';
import { ClueHandlerService } from '@app/services/clue-handler-service/clue-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { NUMBER_CLUES } from '@common/clues';
@Component({
    selector: 'app-clues-area',
    templateUrl: './clues-area.component.html',
    styleUrls: ['./clues-area.component.scss'],
})
export class CluesAreaComponent implements OnInit {
    clueAskedCounter: number;
    private isDisabled: boolean;

    constructor(public gameInformation: GameInformationHandlerService, private readonly clueHandlerService: ClueHandlerService) {
        this.clueAskedCounter = 0;
        this.isDisabled = false;
        this.handleClueAsked();
    }

    ngOnInit(): void {
        this.isDisabled = this.gameInformation.isMulti;
    }

    getClue() {
        this.clueHandlerService.getClue();
    }

    handleClueAsked() {
        this.clueHandlerService.$clueAsked.subscribe(() => {
            this.clueAskedCounter = this.clueHandlerService.getNbCluesAsked();
            if (this.clueAskedCounter === NUMBER_CLUES) {
                this.isDisabled = true;
            }
        });
    }

    isButtonDisabled() {
        return this.isDisabled;
    }
}
