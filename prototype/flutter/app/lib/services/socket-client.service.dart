import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketClient {
  late IO.Socket socket;
  String serverUrl = 'http://10.0.0.9:3000';

  SocketClient() {
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

  void emit(String event, dynamic data) {
    socket.emit(event, data);
  }

  void on(String event, Function callback) {
    socket.on(event, (data) => callback(data));
  }
}

class Event {
  String message = 'message';
  String joinChannel = 'joinChannel';
  String leaveChannel = 'leaveChannel';
}
