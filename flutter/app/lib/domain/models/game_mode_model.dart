import 'package:app/domain/utils/game_mode.dart';

class GameModeModel {
  late String value;

  GameModeModel(GameMode mode) {
    if (mode == GameMode.classic) {
      value = AvailableGameMode.classic;
    } else {
      value = AvailableGameMode.limited;
    }
  }

  factory GameModeModel.fromJson(Map<String, dynamic> json) {
    final rawJsonMode = json['mode'] as String;
    if (rawJsonMode == AvailableGameMode.classic) {
      return GameModeModel(GameMode.classic);
    } else if (rawJsonMode == AvailableGameMode.limited) {
      return GameModeModel(GameMode.limited);
    } else {
      print("Warning: Invalid value: $rawJsonMode");
      return GameModeModel(GameMode.classic);
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'mode': value,
    };
  }
}
