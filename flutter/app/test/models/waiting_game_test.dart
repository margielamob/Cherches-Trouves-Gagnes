import 'package:app/domain/models/waiting_game_model.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('WaitingGameModel Tests', () {
    setUp(() {});

    test('Should create the proper object with fromJson', () {
      final rawJson = {
        "mode": "Classique",
        "gamesWaiting": [
          "f5705e71-c97f-4d60-aced-b20284d895e2",
        ],
      };
      WaitingGameModel waitingGames = WaitingGameModel.fromJson(rawJson);

      expect(waitingGames.mode.value, "Classique");
      expect(waitingGames.gamesWaiting.length, 1);
      expect(
          waitingGames.gamesWaiting[0], "f5705e71-c97f-4d60-aced-b20284d895e2");
    });
  });
}
