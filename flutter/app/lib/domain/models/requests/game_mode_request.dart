import 'package:app/domain/models/game_mode_model.dart';

class GameModeRequest {
  GameModeModel gameModeModel;

  GameModeRequest({required this.gameModeModel});

  Map<String, dynamic> toJson() {
    return gameModeModel.toJson();
  }
}
