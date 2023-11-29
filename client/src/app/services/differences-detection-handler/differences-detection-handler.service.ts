/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-magic-numbers -- display on canvas with settings*/
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlashTimer } from '@app/constants/game-constants';
import { Vec2 } from '@app/interfaces/vec2';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { UserService } from '@app/services/user-service/user.service';
import { Coordinate } from '@common/coordinate';
import { SocketEvent } from '@common/socket-event';
@Injectable({
    providedIn: 'root',
})
export class DifferencesDetectionHandlerService {
    mouseIsDisabled: boolean = false;
    correctSound = new Audio('assets/correctanswer.wav');
    wrongSound = new Audio('assets/wronganswer.wav');

    // eslint-disable-next-line max-params
    constructor(
        public matDialog: MatDialog,
        private readonly socketService: CommunicationSocketService,
        private readonly gameInfoHandlerService: GameInformationHandlerService,
        private userService: UserService,
    ) {}

    setNumberDifferencesFound(playerName: string) {
        const index = this.gameInfoHandlerService.players.findIndex((p) => p.name === playerName);
        if (this.gameInfoHandlerService.players[index]) {
            this.gameInfoHandlerService.players[index].nbDifferences++;
            this.userService.updateNbDifferenceFound(playerName);
            this.gameInfoHandlerService.$differenceFound.next(playerName);
        }
    }

    playWrongSound() {
        this.playSound(this.wrongSound);
    }

    playCorrectSound() {
        this.playSound(this.correctSound);
        this.socketService.off(SocketEvent.DifferenceNotFound);
    }

    playSound(sound: HTMLAudioElement) {
        sound.play();
    }

    // eslint-disable-next-line max-params
    getDifferenceValidation(id: string, mousePosition: Vec2, ctx: CanvasRenderingContext2D, isOriginal: boolean) {
        this.socketService.send(SocketEvent.Difference, {
            differenceCoord: mousePosition,
            roomId: this.gameInfoHandlerService.roomId,
            player: this.userService.activeUser.displayName,
            isOriginal,
        });
        this.handleSocketDifferenceNotFound(ctx, mousePosition);
    }

    handleSocketDifferenceNotFound(ctx: CanvasRenderingContext2D, mousePosition: Vec2) {
        this.socketService.once(SocketEvent.DifferenceNotFound, () => {
            this.differenceNotDetected(mousePosition, ctx);
        });
    }

    differenceNotDetected(mousePosition: Vec2, ctx: CanvasRenderingContext2D, timeFactor: number = 1) {
        this.playWrongSound();
        ctx.fillStyle = 'red';
        ctx.fillText('Erreur', mousePosition.x, mousePosition.y, 30);
        this.mouseIsDisabled = true;

        setTimeout(() => {
            this.mouseIsDisabled = false;
            ctx.clearRect(mousePosition.x, mousePosition.y, 30, -30);
        }, 1000 / timeFactor);
    }

    differenceDetected(ctx: CanvasRenderingContext2D, ctxModified: CanvasRenderingContext2D, coords: Coordinate[], timeFactor: number = 1) {
        this.playCorrectSound();
        const interval = this.displayDifferenceTemp(ctx, coords, false, timeFactor);
        this.clearDifference(ctxModified, coords);
        return interval;
    }
    differenceDetectedLimitedTime(ctxModified: CanvasRenderingContext2D, coords: Coordinate[]) {
        this.clearDifference(ctxModified, coords);
    }

    // eslint-disable-next-line max-params
    displayDifferenceTemp(ctx: CanvasRenderingContext2D, coords: Coordinate[], isCheatMode: boolean, timeFactor: number = 1): number {
        let counter = 0;
        const interval = setInterval(
            () => {
                for (const coordinate of coords) {
                    ctx.clearRect(coordinate.x - 4, coordinate.y - 4, 8, 8);
                }
                if (counter === 5 && !isCheatMode) {
                    clearInterval(interval);
                }
                if (counter % 2 === 0) {
                    ctx.fillStyle = 'yellow';
                    for (const coordinate of coords) {
                        ctx.fillRect(coordinate.x, coordinate.y, 1, 1);
                    }
                }
                counter++;
            },
            isCheatMode ? FlashTimer.CheatMode : FlashTimer.Classic / timeFactor,
        ) as unknown as number;
        return interval;
    }

    clearDifference(ctx: CanvasRenderingContext2D, coords: Coordinate[]) {
        for (const coordinate of coords) {
            ctx.clearRect(coordinate.x, coordinate.y, 1, 1);
        }
    }
}
