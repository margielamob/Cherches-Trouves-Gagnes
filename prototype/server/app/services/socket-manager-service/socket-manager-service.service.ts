import { LoggerService } from '@app/services/logger-service/logger.service';
import { UserManagerService } from '@app/services/prototype-services/user-manager-service.service';
import { Message } from '@common/prototype/message';
import { User } from '@common/prototype/user';
import { SocketEvent } from '@common/socket-event';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';
@Service()
export class SocketManagerService {
    private sio: Server;
    private rooms: Map<string, User[]>;
    private messages: Message[];

    // eslint-disable-next-line max-params -- all services are needed
    constructor(private userManagerService: UserManagerService, private logger: LoggerService) {
        this.rooms = new Map<string, User[]>();
        this.rooms.set('allChatProto', []);
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

            socket.on(SocketEvent.Disconnect, () => {
                this.logger.logWarning(`user disconnected with id : ${socket.id}`);
                this.userManagerService.removeUser(socket.id);
            });

            socket.on(SocketEvent.DisconnectFromChat, () => {
                this.userManagerService.removeUser(socket.id);
            });

            socket.on(SocketEvent.Authenticate, (userName: string) => {
                try {
                    this.userManagerService.addUser(socket.id, userName);
                    socket.join('allChatProto');
                    this.rooms.get('allChatProto')?.push({ username: userName });
                    socket.emit(SocketEvent.UserAuthenticated);
                    this.logger.logInfo(`authenticate successful, ${userName}`);
                } catch (e) {
                    socket.emit(SocketEvent.UserExists);
                    this.logger.logError(e);
                }
            });
            socket.on(SocketEvent.PrototypeMessage, (message: Message) => {
                this.logger.logInfo(message.user.username + ' sent ' + message.message);

                let newMessage = { ...message, date: this.getTime() };

                this.messages.push({ ...message, type: 'from' });
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
