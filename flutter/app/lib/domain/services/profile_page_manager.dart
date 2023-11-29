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
  String imagePath = 'assets/quote_d.png';

  ProfilePageManager() : themeData = DefaultTheme;

  void updateImagePath() {
    String languageCode = Get.locale?.languageCode ?? 'en';

    String themeKey = themeData == DefaultTheme ? 'Default' : 'Alternative';

    if (themeKey == 'Alternative' && languageCode == 'fr') {
      imagePath = 'assets/quote.png';
    } else if (themeKey == 'Alternative' && languageCode == 'en') {
      imagePath = 'assets/search_find_win_prp.jpg';
    } else if (themeKey == 'Default' && languageCode == 'fr') {
      imagePath = 'assets/quote_d.png';
    } else if (themeKey == 'Default' && languageCode == 'en') {
      imagePath = 'assets/search_find_win_blue.jpg';
    } else {
      imagePath = 'assets/quote_d.png';
    }
    notifyListeners();
  }

  void setTheme(String themeValue) {
    ThemeData newTheme = getThemeFromValue(themeValue);
    if (newTheme != themeData) {
      themeData = newTheme;
    }
    updateImagePath();
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
    updateImagePath();
  }

  String getImagePath() => imagePath;
}
