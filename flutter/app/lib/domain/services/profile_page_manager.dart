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

  void setTheme(String themeValue) {
    ThemeData newTheme = getThemeFromValue(themeValue);
    if (newTheme != themeData) {
      themeData = newTheme;
    }
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

  Future<ThemeData> loadTheme(String userId) async {
    String theme = await userService.getUserTheme(userId);
    return getThemeFromValue(theme);
  }
}
