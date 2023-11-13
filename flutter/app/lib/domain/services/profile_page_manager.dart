import 'package:app/domain/models/user_data.dart';
import 'package:app/domain/services/auth_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/domain/themes/theme_constantes.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ProfilePageManager extends ChangeNotifier {
  final PersonalUserService userService = Get.find();
  final AuthService authService = Get.find();
  UserData? currentUser;
  String? avatar;
  ThemeData themeData;

  ProfilePageManager(this.themeData);

  setTheme(String themeValue) {
    themeData = getThemeFromValue(themeValue);
    themeData = themeData;
    notifyListeners();
  }

  getTheme() => themeData;

  ThemeData getThemeFromValue(String themeValue) {
    switch (themeValue) {
      case 'Default':
        return Default;
      case 'Alternative':
        return Alternative;
      default:
        return Default;
    }
  }

  Future<void> initUser() async {
    currentUser = await authService.getCurrentUser();
    if (currentUser != null) {
      if (currentUser!.photoURL == '') {
        avatar = 'assets/default-user-icon.jpg';
        return;
      }
      if (currentUser!.photoURL!.startsWith('assets/')) {
        avatar = currentUser!.photoURL;
      } else {
        avatar = await userService.getPhotoURL(currentUser!.uid);
      }
    }
    notifyListeners();
  }
}
