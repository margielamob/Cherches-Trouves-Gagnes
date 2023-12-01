/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable import/no-named-as-default-member */
import { Injectable } from '@angular/core';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { UserService } from '@app/services/user-service/user.service';
import emailjs from '@emailjs/browser';
import { take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EmailService {
    userName: string;
    userEmail: string;
    timePlayed: number;
    winner: string;
    gameTitle: string;

    constructor(private userService: UserService, private gameInfohndler: GameInformationHandlerService) {
        this.userService
            .getCurrentUser()
            .pipe(take(1))
            .subscribe((user) => {
                if (user) {
                    this.userName = user.displayName;
                    this.userEmail = user.email;
                }
            });
    }

    setTimePlayeed() {
        if (this.gameInfohndler.getGameMode() === 'Classique') {
            if (this.gameInfohndler.timer !== 0) {
                this.timePlayed = this.gameInfohndler.timer - this.gameInfohndler.emailTimer;
            } else {
                this.timePlayed = this.gameInfohndler.startTimer - this.gameInfohndler.emailTimer;
            }
        } else if (this.gameInfohndler.getGameMode() === 'Temps Limité') {
            this.timePlayed = this.gameInfohndler.startTimer - this.gameInfohndler.emailTimer;
        }
    }

    setWinner(winner: string) {
        this.winner = winner;
    }

    setGameTitle(gameTitle: string) {
        this.gameTitle = gameTitle;
    }

    sendEmail() {
        this.setTimePlayeed();
        const emailInfo = {
            toName: this.userName,
            toEmail: this.userEmail,
            timePlayed: this.timePlayed,
            gameMode: this.gameInfohndler.gameMode.valueOf(),
            winner: this.winner,
            gameTitle: this.gameTitle,
        };

        emailjs.send('service_c44otwe', 'template_aj84b6z', emailInfo, 'm8gKT-fbTUbiKG8XF').then(
            (response: { status: any; text: any }) => {
                console.log('SUCCESS!', response.status, response.text);
            },
            (err: any) => {
                console.log('FAILED...', err);
            },
        );
        console.table(emailInfo);
    }
}
