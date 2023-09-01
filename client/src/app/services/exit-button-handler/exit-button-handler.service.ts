import { Injectable } from '@angular/core';
import { Pages } from '@app/interfaces/pages';

@Injectable({
    providedIn: 'root',
})
export class ExitButtonHandlerService {
    currentPage: Pages;

    setGamePage(): void {
        this.currentPage = { game: true, createGame: false, waitingRoom: false };
    }

    setCreateGamePage(): void {
        this.currentPage = { game: false, createGame: true, waitingRoom: false };
    }

    setWaitingRoom(): void {
        this.currentPage = { game: false, createGame: false, waitingRoom: true };
    }

    getTitle(): string {
        if (this.currentPage.game) {
            return 'Quitter la partie ?';
        } else if (this.currentPage.createGame) {
            return 'Quitter la création ?';
        } else if (this.currentPage.waitingRoom) {
            return "Quitter la salle d'attente ?";
        }

        return '';
    }

    getMessage(): string {
        if (this.currentPage.waitingRoom) {
            return 'Êtes-vous certain de vouloir quitter ? Vous serez redirigés vers la page de sélection de jeu.';
        }

        return 'Êtes-vous certain de vouloir quitter ? Votre progrès ne sera pas sauvegardé.';
    }
}
