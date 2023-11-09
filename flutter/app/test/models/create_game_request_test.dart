import 'package:app/domain/models/classic_game_model.dart';
import 'package:app/domain/models/requests/create_classic_game_request.dart';
import 'package:app/domain/models/user_model.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('CreateGameRequest Tests', () {
    test('', () {
      final user = UserModel(id: "1", name: "Thierry", avatar: "avatar");
      final card = ClassicGameModel(id: "card", cheatMode: false, timer: 0);
      final createGameRequest = CreateClassicGameRequest(
        user: user,
        card: card,
      );
      expect(createGameRequest.user.name, "Thierry");
    });
  });
}
