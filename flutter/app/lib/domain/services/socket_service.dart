import 'package:app/domain/utils/base_url.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket socket;
  String serverUrl = BaseURL.socket;
  SocketService() {
    socket = IO.io(serverUrl, <String, dynamic>{
      'transports': ['websocket'],
    });
    // connect();
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
      socket.emit(event,
          (data as Map<String, dynamic>).values.map((value) => value).toList());
    }
  }

  void once(String event, Function callback) {
    socket.once(event, (data) => callback(data));
  }

  void on(String event, Function callback) {
    socket.on(event, (data) => callback(data));
  }

  void off(String event) {
    socket.off(event);
  }
}
