import 'package:app/components/user.dart';
import 'package:app/events/socket-events.dart';
import 'package:app/services/socket-client.service.dart';

class AuthenticationService {
  final User user = User();
  bool _isAccessGranted = false;
  late SocketClient _socketClient;
  AuthenticationService({required SocketClient socketClient})
      : _socketClient = socketClient;

  void setLoginInfos(String username, String password) {
    user.setInfos(username, password);
  }

  void alertLogin() {
    if (!_socketClient.isAlive()) {
      _socketClient.connect();
    }
    // if (!user.isLoggedIn() || !_socketClient.isAlive()) return;
    _socketClient.emit(SocketEvents.Authenticate, user.username);
  }

  void alertLogout() {
    user.dispose();
    _isAccessGranted = false;
    _socketClient.emit(SocketEvents.Disconnect, null);
    _socketClient.disconnect();
  }

  bool isAccessGranted() {
    return _isAccessGranted;
  }

  void handleLogin(void Function(bool isLogged) handleLogin) {
    _handleServerLogin(handleLogin);
    _handleServerRejection(handleLogin);
  }

  void _handleServerLogin(void Function(bool isLogged) handleLogin) {
    _socketClient.on(SocketEvents.UserAuthenticated, (dynamic obj) {
      _isAccessGranted = true;
      handleLogin(_isAccessGranted);
    });
  }

  void _handleServerRejection(void Function(bool isLogged) handleLogin) {
    _socketClient.on(SocketEvents.UserExists, (dynamic obj) {
      _isAccessGranted = false;
      handleLogin(_isAccessGranted);
    });
  }
}
