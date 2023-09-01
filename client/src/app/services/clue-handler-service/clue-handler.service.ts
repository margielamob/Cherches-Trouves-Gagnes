/* eslint-disable @typescript-eslint/no-magic-numbers -- display on canvas with settings*/
import { Injectable } from '@angular/core';
import { SocketEvent } from '@common/socket-event';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { FlashTimer } from '@app/constants/game-constants';
import { Coordinate } from '@common/coordinate';
import { Subject } from 'rxjs';
import { NUMBER_CLUES } from '@common/clues';

@Injectable({
    providedIn: 'root',
})
export class ClueHandlerService {
    $clueAsked: Subject<void> = new Subject();
    private clueAskedCounter: number = 0;

    constructor(public communicationSocket: CommunicationSocketService, public gameInformation: GameInformationHandlerService) {}

    getNbCluesAsked() {
        return this.clueAskedCounter;
    }

    getClue() {
        if (this.canAskForClue()) {
            this.clueAskedCounter++;
            this.$clueAsked.next();
            this.communicationSocket.send(SocketEvent.Clue, { gameId: this.gameInformation.roomId });
        }
    }

    isGameOver() {
        return this.gameInformation.getNbDifferences(this.gameInformation.getPlayer().name) === this.gameInformation.getNbTotalDifferences();
    }

    resetNbClue() {
        this.clueAskedCounter = 0;
    }

    async showClue(ctx: CanvasRenderingContext2D, quadrantCoordinate: Coordinate[]) {
        this.drawRect(ctx, quadrantCoordinate);
    }

    private canAskForClue() {
        return !this.isGameOver() && this.clueAskedCounter < NUMBER_CLUES && !this.gameInformation.isMulti;
    }

    private drawRect(ctx: CanvasRenderingContext2D, quadrantCoordinate: Coordinate[]) {
        const width = Math.abs(quadrantCoordinate[1].x - quadrantCoordinate[0].x);
        const height = Math.abs(quadrantCoordinate[1].y - quadrantCoordinate[0].y);
        let counter = 0;
        ctx.save();
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'yellow';
        ctx.strokeStyle = 'red';
        const interval = setInterval(() => {
            ctx.clearRect(quadrantCoordinate[0].x - 20, quadrantCoordinate[0].y - 20, width + 30, height + 30);
            if (counter === 5) {
                clearInterval(interval);
                ctx.restore();
            }
            if (counter % 2 === 0) {
                ctx.strokeRect(quadrantCoordinate[0].x, quadrantCoordinate[0].y, width, height);
            }
            counter++;
        }, FlashTimer.Classic) as unknown as number;
    }
}
