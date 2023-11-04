import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/models/game_model.dart';
import 'package:app/domain/models/requests/create_game_request.dart';
import 'package:app/domain/utils/game_mode.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('CreateGameRequest Tests', () {
    test('', () {
      final game = GameModel(card: "card", isMulti: false);
      final createGameRequest = CreateGameRequest(
          game: game,
          gameMode: GameModeModel(GameMode.classic),
          player: "Thierry");
      expect(createGameRequest.player, "Thierry");
    });
  });
}
