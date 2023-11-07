import 'package:app/domain/models/event_queue.dart';
import 'package:app/domain/models/replay_state.dart';

class ReplayService {
  final eventQueue = EventQueue();
  final replayState = ReplayState.stopped;
}
