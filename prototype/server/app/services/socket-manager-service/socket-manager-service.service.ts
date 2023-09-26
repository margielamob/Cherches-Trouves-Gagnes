import { LoggerService } from '@app/services/logger-service/logger.service';
import { UserManagerService } from '@app/services/prototype-services/user-manager-service.service';
import { Message } from '@common/prototype/message';
import { SocketEvent } from '@common/socket-event';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';
@Service()
export class SocketManagerService {
    private sio: Server;
    private messages: Message[];

    // eslint-disable-next-line max-params -- all services are needed
    constructor(private userManagerService: UserManagerService, private logger: LoggerService) {
        this.messages = [];
    }

    set server(server: http.Server) {
        this.sio = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        if (!this.sio) {
            throw new Error('Server instance not set');
        }
        this.sio.on(SocketEvent.Connection, (socket: Socket) => {
            this.logger.logInfo(`new user connected with : ${socket.id}`);

            socket.on('disconnect', () => {
                this.logger.logWarning(`user disconnected with id : ${socket.id}`);
                this.userManagerService.removeUser(socket.id);
            });

            socket.on(SocketEvent.DisconnectFromChat, () => {
                this.userManagerService.removeUser(socket.id);
                this.logger.logWarning(`user left chat with id : ${socket.id}`);
            });

            socket.on(SocketEvent.Authenticate, (userName: string) => {
                try {
                    this.userManagerService.addUser(socket.id, userName);

                    socket.join('allChatProto');

                    socket.emit(SocketEvent.UserAuthenticated);

                    this.logger.logInfo(`authenticate successful`);
                } catch (e) {
                    socket.emit(SocketEvent.UserExists);

                    this.logger.logError(e);
                }
            });
            socket.on(SocketEvent.PrototypeMessage, (message: Message) => {
                this.logger.logInfo(message.user.username + ' sent ' + message.message);

                let newMessage = { ...message, date: this.getTime() };

                this.messages.push(newMessage);
                socket.emit(SocketEvent.NewMessage, { ...newMessage, type: 'to' });
                socket.to('allChatProto').emit(SocketEvent.NewMessage, { ...newMessage, type: 'from' });
            });

            socket.on(SocketEvent.FetchMessages, () => {
                this.logger.logInfo('serving messages...');
                this.sio.to('allChatProto').emit(SocketEvent.ServeMessages, this.messages);
            });
        });
    }

    getTime() {
        return this.formatTime(new Date());
    }

    private formatTime(date: Date) {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    }
}
