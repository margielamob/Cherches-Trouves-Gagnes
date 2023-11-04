import 'package:app/domain/models/requests/game_info_request.dart';
import 'package:flutter_test/flutter_test.dart';

import 'game_info_request_test.data.dart';

void main() {
  group('GameAndCardRequest Tests', () {
    test('Should create the proper object', () {
      final rawJson = gameInfoRequestTest;
      GameInfoRequest games = GameInfoRequest.fromJson(rawJson);

      expect(games.gameId, "09751349-3ead-40d1-bb7c-210005979002");
      expect(games.gameCard?.name, 'saoulGame');
    });
  });
}
