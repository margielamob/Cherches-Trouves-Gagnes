import { Injectable } from '@angular/core';
import { Pages } from '@app/interfaces/pages';
import { LanguageService } from '@app/services/language-service/languag.service';

@Injectable({
    providedIn: 'root',
})
export class ExitButtonHandlerService {
    currentPage: Pages;

    constructor(private langService: LanguageService) {}

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
            return this.langService.getCurrentLanguage() === 'Fr' ? 'Quitter la partie ?' : 'Leave game ?';
        } else if (this.currentPage.createGame) {
            return this.langService.getCurrentLanguage() === 'Fr' ? 'Quitter la création de partie ?' : 'Leave game creation ?';
        } else if (this.currentPage.waitingRoom) {
            return this.langService.getCurrentLanguage() === 'Fr' ? "Quitter la salle d'attente ?" : 'Leave waiting room ?';
        }
        return '';
    }

    getMessage(): string {
        if (this.currentPage.waitingRoom) {
            return this.langService.getCurrentLanguage() === 'Fr'
                ? "Êtes-vous certain de vouloir quitter la salle d'attente ?"
                : 'Are you sure you want to leave the waiting room ?';
        }

        return this.langService.getCurrentLanguage() === 'Fr' ? 'Êtes-vous certain de vouloir quitter?' : 'Are you sure you want to leave ?';
    }
}
