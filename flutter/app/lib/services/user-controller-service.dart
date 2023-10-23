import 'package:app/services/auth-service.dart';
import 'package:app/services/user-service.dart';
import 'package:get/get.dart';

class UserControllerService {
  UserService userService = Get.find();
  AuthService authService = Get.find();
  UserData? currentUser;
  String? userAvatarUrl;
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
        print(currentUser!.displayName);
      }
    });
  }

  Future<UserData?> initUser() async {
    currentUser = await authService.getCurrentUser();
    return currentUser;
  }

  Future<String?> UserAvatar(UserData user) async {
    if (user.photoURL!.startsWith('assets/')) {
      userAvatarUrl = user.photoURL;
      return userAvatarUrl;
    }
    userAvatarUrl = await userService.getPhotoURL(currentUser!.uid);
    return userAvatarUrl;
  }
}
