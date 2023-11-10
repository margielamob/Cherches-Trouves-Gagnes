import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';

import { Server } from 'socket.io';

@Service()
export class SocketServer {
    sio: io.Server;

    set server(server: http.Server) {
        this.sio = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }
}
