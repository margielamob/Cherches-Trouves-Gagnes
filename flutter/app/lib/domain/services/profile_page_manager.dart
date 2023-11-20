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

  ProfilePageManager() : themeData = DefaultTheme;

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
        return DefaultTheme;
      case 'Alternative':
        return AlternativeTheme;
      default:
        return DefaultTheme;
    }
  }

  Future<void> initUserThemeAndLang() async {
    String userId = await authService.getCurrentUserId();
    String themeValue = await userService.getUserTheme(userId);
    String langValue = await userService.getUserLang(userId);
    String language = langValue == 'Fr' ? 'Français' : 'English';
    setLang(language);
    setTheme(themeValue);
  }

  Future<ThemeData> loadTheme(String userId) async {
    String theme = await userService.getUserTheme(userId);
    return getThemeFromValue(theme);
  }

  setLang(String language) {
    String languageCode = language == 'English' ? 'en' : 'fr';
    Locale newLocale = Locale(languageCode, '');
    Get.updateLocale(newLocale);
  }
}
