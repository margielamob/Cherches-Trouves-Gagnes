import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    isCreator: boolean = false;
    players: User[] = [];
    canStartGame: boolean = false;
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
        this.isCreator = this.gameInformationHandlerService.isCreator;
        this.players = this.gameInformationHandlerService.playersEX;
        if (this.players.length < 2) {
            this.canStartGame = false;
        } else if (this.players.length >= 2) {
            this.canStartGame = true;
        }
        this.socketService.on(SocketEvent.UpdatePlayers, (info: WaitingRoomInfo) => {
            this.players = info.players;
            if (this.players.length < 2) {
                this.canStartGame = false;
            } else if (this.players.length >= 2) {
                this.canStartGame = true;
            }
        });

        this.socketService.on(SocketEvent.CreatorLeft, () => {
            this.routerService.navigateTo('home');
        });

        this.socketService.once(SocketEvent.JoinGame, (data: { roomId: string }) => {
            for (const player of this.players) {
                if (!(player.name === this.gameInformationHandlerService.getPlayer().name)) {
                    this.gameInformationHandlerService.setPlayerName(player.name);
                }
            }

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
    // quit() {
    //     setTimeout(() => {
    //         this.chatManager.leaveGameChat();
    //         this.socketService.send(SocketEvent.LeaveWaitingRoom, {
    //             roomId: this.gameInformationHandlerService.roomId,
    //             name: this.gameInformationHandlerService.getPlayer().name,
    //         });
    //         this.routerService.navigateTo('home');
    //     }, 0);
    // }

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
        // this.gameInformationHandlerService.resetGameVariables();
    }
}
