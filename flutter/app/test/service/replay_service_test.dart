import 'package:app/domain/models/event_queue.dart';
import 'package:app/domain/models/replay_state.dart';
import 'package:app/domain/services/replay_service.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';

void main() {
  group('ReplayService Tests', () {
    setUp(() {
      Get.testMode = true;
      Get.put<ReplayService>(ReplayService());
    });

    test('replayService should exists', () async {
      Get.find<ReplayService>();
    });

    test('replayService should have an eventQueue', () {
      final replayService = Get.find<ReplayService>();
      expect(replayService.eventQueue, isA<EventQueue>());
    });

    test('replayState of replayService should by default be on pause', () {
      final replayService = Get.find<ReplayService>();
      expect(replayService.replayState, isA<ReplayState>());
      expect(replayService.replayState, ReplayState.stopped);
    });
  });
}
