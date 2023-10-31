import { RejectMessages } from '@app/interface/reject-messages';
import { GameMode } from '@common/game-mode';
import { User } from '@common/user';
import { Service } from 'typedi';

@Service()
export class MultiplayerGameManager {
    requestsOnHold: Map<string, User[]> = new Map();
    rejectMessages = {} as RejectMessages;
    private gamesWaiting: { gameId: string; mode: GameMode; roomId: string; players: User[] }[] = [];

    constructor() {
        this.initializeRejectMessages();
    }

    addPlayerToRoom(roomId: string, player: User) {
        this.findGameByRoomId(roomId)?.players.push(player);
    }
    theresOneRequest(roomId: string) {
        return this.requestsOnHold.get(roomId)?.length === 1;
    }

    theresARequest(roomId: string) {
        const length = this.requestsOnHold.get(roomId)?.length;
        return length ? length > 0 : false;
    }

    playersRequestExists(roomId: string, playerId: string) {
        const requests = this.getRequest(roomId);
        if (requests) {
            for (const request of requests) {
                if (request.id === playerId) {
                    return true;
                }
            }
        }
        return false;
    }

    getRequest(gameId: string) {
        return this.requestsOnHold.has(gameId) ? this.requestsOnHold.get(gameId) : [];
    }

    isNotAPlayersRequest(playersRoom: string, opponentsRoomId: string) {
        return playersRoom !== opponentsRoomId;
    }

    addNewRequest(roomId: string, player: User) {
        if (this.requestsOnHold.has(roomId)) {
            this.requestsOnHold.set(roomId, [...(this.requestsOnHold.get(roomId) as User[]), player]);
            return;
        }

        this.requestsOnHold.set(roomId, [player]);
    }

    deleteFirstRequest(roomId: string) {
        this.requestsOnHold.set(roomId, this.requestsOnHold.get(roomId)?.slice(1) as User[]);
    }

    deleteAllRequests(roomId: string) {
        this.requestsOnHold.delete(roomId);
    }

    deleteRequest(roomId: string, playerId: string) {
        const requests = this.getRequest(roomId);
        if (requests) {
            for (let i = 0; i < requests.length; i++) {
                if (requests[i].id === playerId) {
                    requests.splice(i, 1);
                }
            }
            this.requestsOnHold.set(roomId, requests);
        }
    }

    getNewRequest(roomId: string) {
        return (this.requestsOnHold.get(roomId) as User[])[0];
    }

    getGamesWaiting(mode: GameMode) {
        const gamesId = [];
        for (const game of this.gamesWaiting) {
            if (game.mode === mode) {
                gamesId.push(game.gameId);
            }
        }
        return gamesId;
    }

    isGameWaiting(gameId: string, mode: GameMode | undefined) {
        if (!mode) {
            return this.gamesWaiting.map((game: { gameId: string; roomId: string }) => game.gameId).includes(gameId);
        }
        return (
            this.gamesWaiting.map((game: { gameId: string; mode: GameMode; roomId: string }) => game.gameId).includes(gameId) &&
            this.gamesWaiting.map((game: { gameId: string; mode: GameMode; roomId: string }) => game.mode).includes(mode)
        );
    }

    getRoomIdWaiting(gameId: string) {
        const gameWaiting = this.gamesWaiting.find((game: { gameId: string; roomId: string }) => game.gameId === gameId);
        return !gameWaiting ? '' : gameWaiting.roomId;
    }

    addGameWaiting(infos: { gameId: string; mode: GameMode; roomId: string; players: User[] }): void {
        this.gamesWaiting.push(infos);
    }

    removeGameWaiting(roomId: string) {
        this.gamesWaiting = this.gamesWaiting.filter((game: { gameId: string; roomId: string }) => game.roomId !== roomId);
    }

    getPlayers(roomId: string) {
        return this.findGameByRoomId(roomId)?.players;
    }

    private findGameByRoomId(roomId: string): { gameId: string; mode: GameMode; roomId: string; players: User[] } | undefined {
        return this.gamesWaiting.find((game) => game.roomId === roomId);
    }

    private initializeRejectMessages() {
        this.rejectMessages.deletedGame = 'le jeu a été supprimé';
        this.rejectMessages.wrongName = 'vous devez choisir un autre nom de joueur';
        this.rejectMessages.allGamesDeleted = 'tous les jeux ont été supprimés';
        this.rejectMessages.playerQuit = 'le joueur a quitté.';
        this.rejectMessages.rejected = 'le joueur a refusé votre demande.';
        this.rejectMessages.gameStarted = 'la partie a déjà commencé.';
    }
}
