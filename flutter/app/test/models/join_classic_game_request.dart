import 'package:app/domain/models/requests/join_classic_game_request.dart';
import 'package:app/domain/models/user_model.dart';
import 'package:flutter_test/flutter_test.dart';

final expectedJson = {
  "player": {
    "name": "thierry123",
    "avatar": "",
    "socketId": "UQ5UeIXhuHKWJY78AAAm",
  },
  "roomId": "a2313eb8-3e6d-46a3-bb9f-97c484736b8b",
};

void main() {
  group('JoinClassicGameRequest Tests', () {
    test('should contain a roomId ', () {
      final currentPlayer =
          UserModel(id: "doesntmatter", name: "thierry123", avatar: "");
      const String socketId = "UQ5UeIXhuHKWJY78AAAm";
      const String roomId = "a2313eb8-3e6d-46a3-bb9f-97c484736b8b";
      final classicGameRequest = JoinClassicGameRequest(
          user: currentPlayer, socketId: socketId, roomId: roomId);
      final player = classicGameRequest.user;

      expect(classicGameRequest.roomId, "a2313eb8-3e6d-46a3-bb9f-97c484736b8b");
      expect(classicGameRequest.socketId, "UQ5UeIXhuHKWJY78AAAm");
      expect(player.name, "thierry123");
      expect(player.avatar, "");
    });

    test('should convert correctly to the Json expected', () {
      final currentPlayer =
          UserModel(id: "doesntmatter", name: "thierry123", avatar: "");
      const String socketId = "UQ5UeIXhuHKWJY78AAAm";
      const String roomId = "a2313eb8-3e6d-46a3-bb9f-97c484736b8b";
      final classicGameRequest = JoinClassicGameRequest(
          user: currentPlayer, socketId: socketId, roomId: roomId);
      final jsonGameRequest = classicGameRequest.toJson();

      expect(jsonGameRequest, expectedJson);
    });
  });
}
