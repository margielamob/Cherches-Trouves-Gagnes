import 'package:app/main.dart';
import 'package:app/services/auth-service.dart';
import 'package:app/services/user-service.dart';

class UserControllerService {
  UserData? currentUser;
  String? userAvatarUrl;
  AuthService authService = locator.get<AuthService>();
  UserService userService = locator.get<UserService>();
  Future<UserData?>? init;
  Future<String?>? avatarInit;
  Function(UserData?)? onUserDataReady;
  Function(String?)? onUserAvatarReady;

  UserControllerService() {
    initUser().then((userData) {
      if (onUserDataReady != null) {
        onUserDataReady!(userData);
        UserAvatar(currentUser!).then((userAvatar) {
          if (onUserAvatarReady != null) {
            onUserAvatarReady!(userAvatar);
          }
        });
      }
    });
  }

  Future<UserData?> initUser() async {
    currentUser = await authService.getCurrentUser();
    return currentUser;
  }

  Future<String?> UserAvatar(UserData user) async {
    userAvatarUrl = await userService.getPhotoURL(currentUser!.uid);
    return userAvatarUrl;
  }
}
