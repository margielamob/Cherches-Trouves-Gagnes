import 'package:app/components/user.dart';
import 'package:app/services/socket-client.service.dart';

class AuthenticationService {
  late User user;
  late SocketClient socketClient;
  AuthenticationService({required this.socketClient});

  void logIn(String username, String password) {
    user = User();
    user.setInfos(username, password);
  }

  void alertConnection() {
    if (!user.isLoggedIn()) return;
    socketClient.emit('logIn', user.toJson());
  }
}
