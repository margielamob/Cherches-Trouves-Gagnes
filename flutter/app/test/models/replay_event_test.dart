import 'package:app/domain/models/replay_event.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ReplayEvent tests', () {
    test('ReplayEvent should contain the time when the event was registered',
        () {
      const expectTimeStamp = 0;
      final replayEvent = ReplayEvent(timeStamp: expectTimeStamp);
      expect(replayEvent.timeStamp, expectTimeStamp);
    });
  });
}
