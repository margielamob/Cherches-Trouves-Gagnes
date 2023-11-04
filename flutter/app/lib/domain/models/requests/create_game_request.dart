import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/models/game_model.dart';

class CreateGameRequest {
  GameModeModel gameMode;
  String player;
  GameModel game;

  CreateGameRequest(
      {required this.gameMode, required this.player, required this.game});

  Map<String, dynamic> toJson() {
    return {
      'player': player,
      'mode': gameMode.value,
      'game': {
        'card': game.card,
        'isMulti': game.isMulti,
      },
    };
  }
}
