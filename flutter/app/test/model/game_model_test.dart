import 'package:app/domain/models/play_game_model.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('PlayGameModel Tests', () {
    setUp(() {});

    test('Should create the proper object', () {
      final rawJson = {
        "gameId": '09751349-3ead-40d1-bb7c-210005979002',
        "gameCard": {
          "id": '97b430aa-fcd3-451c-8118-18a5e9b18636',
          "name": 'saoulGame',
          "thumbnail": 'data:image/png;base64,Qk02EA4AAAAAADYAAA',
          "nbDifferences": 3,
          "idEditedBmp": 'db0f9c65-36aa-4ceb-81a8-364774c1bb5b',
          "idOriginalBmp": '8a5c25fa-ddea-4c51-a38c-9bdc97979969',
          "multiplayerScore": [],
          "soloScore": [],
          "isMulti": false,
        }
      };
      PlayGameModel games = PlayGameModel.fromJson(rawJson);

      expect(games.gameId, "09751349-3ead-40d1-bb7c-210005979002");
      expect(games.gameCard?.name, 'saoulGame');
    });
  });
}
