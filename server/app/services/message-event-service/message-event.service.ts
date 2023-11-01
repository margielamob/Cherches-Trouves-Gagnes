import { MessageData } from '@app/interface/message-data';
import { MessageRecord } from '@common/message-record';
import { Service } from 'typedi';

@Service()
export class EventMessageService {
    differenceFoundMessage(userName?: string, isMulti?: boolean): MessageData {
        const time = new Date().toLocaleTimeString('en-US');
        const params = { userName, time };

        if (isMulti && userName) {
            return {
                messageKey: 'CHAT-BOX.DIFFERENCE_FOUND_BY',
                params,
            };
        } else {
            return {
                messageKey: 'CHAT-BOX.DIFFERENCE_FOUND',
                params,
            };
        }
    }

    differenceNotFoundMessage(userName?: string, isMulti?: boolean): MessageData {
        const time = new Date().toLocaleTimeString('en-US');
        const params = { userName, time };

        if (isMulti && userName) {
            return {
                messageKey: 'CHAT-BOX.ERROR_BY',
                params,
            };
        } else {
            return {
                messageKey: 'CHAT-BOX.ERROR',
                params,
            };
        }
    }

    leavingGameMessage(userName: string): MessageData | null {
        const time = new Date().toLocaleTimeString('en-US');
        const params = { userName, time };

        if (userName) {
            return {
                messageKey: 'CHAT-BOX.LEAVING_GAME',
                params,
            };
        }
        return null;
    }

    usingClueMessage(): MessageData {
        const time = new Date().toLocaleTimeString('en-US');
        const params = { time };

        return {
            messageKey: 'CHAT-BOX.USING_CLUE',
            params,
        };
    }

    sendNewHighScoreMessage(messageRecord: MessageRecord): MessageData {
        const time = new Date().toLocaleTimeString('en-US');
        const gameMode = messageRecord.isMulti ? 'multijoueur' : 'solo';
        const params = {
            time,
            playerName: messageRecord.playerName,
            recordIndex: messageRecord.record.index,
            gameName: messageRecord.gameName,
            gameMode,
        };

        return {
            messageKey: 'CHAT-BOX.NEW_HIGH_SCORE',
            params,
        };
    }
}
