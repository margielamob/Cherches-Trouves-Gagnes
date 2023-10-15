import 'package:app/main.dart';
import 'package:app/services/auth-service.dart';
import 'package:app/services/user-service.dart';

class UserControllerService {
  UserData? currentUser;
  AuthService authService = locator.get<AuthService>();
  Future<UserData?>? init;
  Function(UserData?)? onUserDataReady;

  UserControllerService() {
    initUser().then((userData) {
      if (onUserDataReady != null) {
        onUserDataReady!(userData);
      }
    });
  }

  Future<UserData?> initUser() async {
    currentUser = await authService.getCurrentUser();
    return currentUser;
  }
}
