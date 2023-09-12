import { Service } from 'typedi';
import * as winston from 'winston';
import { LOG_COLORS } from './log-colors';
@Service()
export class LoggerService {
    private logger;

    constructor() {
        winston.addColors(LOG_COLORS);
        this.logger = winston.createLogger({
          transports: [
            new winston.transports.Console(),
          ],
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            winston.format.errors({stack: true}),
            LoggerService.logFormat
          ),
        });
    }

    public logInfo(message: string) {
        this.logger.info(message);
    }

    public logError(error: Error) {
        this.logger.error(error.stack);
    }

    public logWarning(message: string) {
        this.logger.warn(message);
    }

    public logDebug(message: string) {
        this.logger.debug(message);
    }

    private static logFormat = winston.format.printf(({ level, message, stack, timestamp }) => {
      return `[${level}] ${ timestamp } : ${ message || stack }`;
    });
};
