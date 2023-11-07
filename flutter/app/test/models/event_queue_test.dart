import 'package:app/domain/models/event_queue.dart';
import 'package:app/domain/models/replay_event.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('EventQueue tests', () {
    test('EventQueue should contain a list of ReplayEvents', () {
      final eventQueue = EventQueue();
      expect(eventQueue.queue, isA<List<ReplayEvent>>());
      expect(eventQueue.queue.length, 0);
    });
  });
}
