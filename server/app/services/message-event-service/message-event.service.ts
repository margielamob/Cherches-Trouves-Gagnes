import { MessageRecord } from '@common/message-record';
import { Service } from 'typedi';

@Service()
export class EventMessageService {
    differenceFoundMessage(userName?: string | undefined, isMulti?: boolean | undefined) {
        return isMulti && userName
            ? `Difference trouvée par ${userName} a ${new Date().toLocaleTimeString('en-US')}`
            : `Difference trouvée a ${new Date().toLocaleTimeString('en-US')}`;
    }

    differenceNotFoundMessage(userName?: string | undefined, isMulti?: boolean | undefined) {
        return isMulti && userName
            ? `Erreur par ${userName} a ${new Date().toLocaleTimeString('en-US')}`
            : `Erreur a ${new Date().toLocaleTimeString('en-US')}`;
    }

    leavingGameMessage(userName: string | undefined) {
        return userName ? `${userName} a abandonné la partie a ${new Date().toLocaleTimeString('en-US')}` : null;
    }

    usingClueMessage() {
        return `${new Date().toLocaleTimeString('en-US')} - Indice Utilisé`;
    }

    sendNewHighScoreMessage(messageRecord: MessageRecord): string {
        const gameMode = messageRecord.isMulti ? 'multijoueur' : 'solo';
        return `${new Date().toLocaleTimeString('en-US')} - 
        ${messageRecord.playerName} obtient la ${messageRecord.record.index} place dans les meilleurs temps du jeu 
        ${messageRecord.gameName} en ${gameMode}`;
    }
}
