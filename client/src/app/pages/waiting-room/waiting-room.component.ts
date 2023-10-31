import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalDialogComponent } from '@app/components/approval-dialog/approval-dialog.component';
import { RejectedDialogComponent } from '@app/components/rejected-dialog/rejected-dialog.component';
import { Theme } from '@app/enums/theme';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { RouterService } from '@app/services/router-service/router.service';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import { WaitingRoomInfo } from '@common/waiting-room-info';
@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit, OnDestroy {
    favoriteTheme: string = Theme.ClassName;
    players: User[] = [];
    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private exitButton: ExitButtonHandlerService,
        public socketService: CommunicationSocketService,
        public dialog: MatDialog,
        private readonly routerService: RouterService,
        private readonly gameInformationHandlerService: GameInformationHandlerService,
    ) {
        this.exitButton.setWaitingRoom();
    }

    ngOnInit(): void {
        this.players = this.gameInformationHandlerService.playersEX;
        this.socketService.on(SocketEvent.RequestToJoin, (player: User) => {
            this.dialog.open(ApprovalDialogComponent, { disableClose: true, data: { opponentsName: player.name, opponentsRoomId: player.id } });
        });

        this.socketService.on(SocketEvent.RejectPlayer, (reason: string) => {
            this.dialog.closeAll();
            this.dialog.open(RejectedDialogComponent, { data: { reason } });
            if (this.gameInformationHandlerService.isClassic()) {
                this.routerService.navigateTo('/select');
            } else if (this.gameInformationHandlerService.isLimitedTime()) {
                this.routerService.navigateTo('/');
            }
        });
        this.socketService.on(SocketEvent.UpdatePlayers, (info: WaitingRoomInfo) => {
            this.players.push(info.players[info.players.length - 1]);
        });

        this.socketService.once(SocketEvent.JoinGame, (data: { roomId: string; playerName: string }) => {
            this.gameInformationHandlerService.setPlayerName(data.playerName);

            this.socketService.send(SocketEvent.JoinGame, { player: this.gameInformationHandlerService.getPlayer().name, room: data.roomId });
            this.gameInformationHandlerService.roomId = data.roomId;

            if (this.gameInformationHandlerService.isClassic()) {
                this.socketService.on(SocketEvent.Play, (id: string) => {
                    this.gameInformationHandlerService.roomId = id;
                    this.routerService.navigateTo('game');
                });
            }
        });
    }

    play() {
        this.socketService.send(SocketEvent.Ready, { roomId: this.gameInformationHandlerService.roomId });
    }

    ngOnDestroy() {
        this.socketService.off(SocketEvent.RequestToJoin);
        this.socketService.off(SocketEvent.RejectPlayer);
        if (!this.gameInformationHandlerService.gameInformation) {
            this.socketService.send(SocketEvent.LeaveWaiting, {
                roomId: this.gameInformationHandlerService.roomId,
                gameCard: undefined,
            });
        } else if (this.gameInformationHandlerService.roomId) {
            this.socketService.send(SocketEvent.LeaveWaiting, {
                roomId: this.gameInformationHandlerService.roomId,
                gameCard: this.gameInformationHandlerService.getId(),
            });
        } else {
            this.socketService.send(SocketEvent.LeaveWaiting, { roomId: undefined, gameCard: this.gameInformationHandlerService.getId() });
        }
    }
}
