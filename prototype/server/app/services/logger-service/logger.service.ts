import { Service } from 'typedi';
import * as winston from 'winston';
import { LOG_COLORS } from './log-colors';

@Service()
export class LoggerService {
    private static logFormat = winston.format.printf(({ level, message, stack, timestamp, objectToLog }) => {
        const logMessage = objectToLog ? `${message} - ${JSON.stringify(objectToLog)}` : message;
        return `[${level}] ${timestamp} : ${logMessage || stack}`;
    });

    private logger;

    constructor() {
        winston.addColors(LOG_COLORS);
        this.logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                LoggerService.logFormat,
            ),
        });
    }

    logInfo(message: string, objectToLog?: object) {
        this.log('info', message, objectToLog);
    }

    logError(error: Error, objectToLog?: object) {
        const errorMessage = error.message;
        const errorStack = error.stack;
        this.log('error', errorStack ? `${errorMessage}\n${errorStack}` : errorMessage, objectToLog);
    }

    logWarning(message: string, objectToLog?: object) {
        this.log('warn', message, objectToLog);
    }

    logDebug(message: string, objectToLog?: object) {
        this.log('debug', message, objectToLog);
    }

    private log(level: string, message: string, objectToLog?: object) {
        this.logger.log({ level, message, objectToLog });
    }
}
