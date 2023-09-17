import 'package:app/components/user.dart';
import 'package:app/services/socket-client.service.dart';

class AuthenticationService {
  final User user = User();
  late SocketClient socketClient;
  AuthenticationService({required this.socketClient});

  void logIn(String username, String password) {
    user.setInfos(username, password);
  }

  void alertConnection() {
    socketClient.connect();
    if (!user.isLoggedIn() && !socketClient.isAlive()) return;
    socketClient.emit('logIn', user.toJson());
  }
}
