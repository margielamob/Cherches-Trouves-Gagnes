import 'package:app/domain/utils/game.dart';

class CreateGameRequest {
  String gameMode;
  String player;
  Game game;

  CreateGameRequest(
      {required this.gameMode, required this.player, required this.game});

  Map<String, dynamic> toJson() {
    return {
      'player': player,
      'mode': gameMode,
      'game': {
        'card': game.card,
        'isMulti': game.isMulti,
      },
    };
  }
}
