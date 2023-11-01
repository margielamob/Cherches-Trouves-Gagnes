import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket socket;
  String serverUrl = 'http://localhost:3000';

  SocketService() {
    socket = IO.io(serverUrl, <String, dynamic>{
      'transports': ['websocket'],
    });
  }

  void connect() {
    socket.connect();
  }

  void disconnect() {
    socket.disconnect();
  }

  bool isAlive() {
    return socket.active && socket.connected;
  }

  void send<T>(String event, [T? data]) {
    if (data == null) {
      socket.emit(event);
    } else {
      socket.emit(event, [data]);
    }
  }

  void on(String event, Function callback) {
    socket.on(event, (data) => callback(data));
  }

  void off(String event) {
    socket.off(event);
  }
}
