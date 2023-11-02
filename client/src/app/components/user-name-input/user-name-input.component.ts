import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogLimitedTimeComponent } from '@app/components/dialog-limited-time/dialog-limited-time.component';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { SocketEvent } from '@common/socket-event';

@Component({
    selector: 'app-user-name-input',
    templateUrl: './user-name-input.component.html',
    styleUrls: ['./user-name-input.component.scss'],
})
export class UserNameInputComponent {
    form: FormGroup = new FormGroup({ name: new FormControl('', [this.noWhiteSpaceValidator, Validators.required]) });
    private isMulti: boolean;
    private playerName: string;
    private isValid: boolean = false;

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly dialogRef: MatDialogRef<UserNameInputComponent>,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
        private communicationSocketService: CommunicationSocketService,
        private readonly matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) private data: { isMulti: boolean },
    ) {
        this.isMulti = this.data.isMulti;
    }

    noWhiteSpaceValidator(control: FormControl): { [key: string]: boolean } | null {
        return !((control.value || '').trim().length === 0) ? null : { whitespace: true };
    }

    onClickContinue(): void {
        this.playerName = (this.form.get('name') as FormControl).value;
        this.gameInformationHandlerService.resetPlayers();
        this.gameInformationHandlerService.getConstants();
        if (this.isValidName()) {
            this.gameInformationHandlerService.setPlayerName(this.playerName);
            this.dialogRef.close(true);

            if (this.gameInformationHandlerService.isLimitedTime()) {
                this.openGameModeDialog();
                return;
            }
            if (!this.isMulti) {
                this.communicationSocketService.send(SocketEvent.CreateGame, {
                    player: this.playerName,
                    mode: this.gameInformationHandlerService.gameMode,
                    game: { card: this.gameInformationHandlerService.getId(), isMulti: this.isMulti },
                });
                this.gameInformationHandlerService.handleSocketEvent();
                return;
            }

            this.communicationSocketService.send(SocketEvent.CreateGameMulti, {
                player: this.playerName,
                mode: this.gameInformationHandlerService.gameMode,
                game: { card: this.gameInformationHandlerService.getId(), isMulti: this.isMulti },
            });
            this.gameInformationHandlerService.handleSocketEvent();
        }
    }

    isValidName(): boolean {
        this.playerName = this.playerName.trim();
        this.isValid = this.playerName !== undefined && this.playerName !== '';
        return this.isValid;
    }

    openGameModeDialog() {
        this.matDialog.open(DialogLimitedTimeComponent);
    }
}
