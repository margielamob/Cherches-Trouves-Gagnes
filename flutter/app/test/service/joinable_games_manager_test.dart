import 'package:app/domain/services/reachable_games_manager.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';

void main() {
  group('JoinableGamesService Tests', () {
    setUp(() {
      Get.testMode = true;
      Get.put<SocketService>(SocketService());
      Get.put<ReachableGameManager>(ReachableGameManager());
    });

    test('should initially have an empty amount of joinableGames', () async {
      final joinableGamesManager = Get.find<ReachableGameManager>();
      expect(joinableGamesManager.joinableGames, null);
    });
  });
}
