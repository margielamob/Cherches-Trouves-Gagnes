import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/models/requests/game_mode_request.dart';
import 'package:app/domain/utils/game_mode.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('GameModeRequest Tests', () {
    test('toJson should return a valid json', () {
      final jsonExpected = {"mode": "Classique"};
      final gameModeModel = GameModeModel(GameMode.classic);
      final gameModeRequest = GameModeRequest(gameModeModel: gameModeModel);
      expect(jsonExpected, gameModeRequest.toJson());
    });
  });
}
