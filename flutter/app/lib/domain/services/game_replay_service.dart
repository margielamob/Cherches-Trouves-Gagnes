import 'package:flutter/foundation.dart';

class GameReplayService extends ChangeNotifier {
  GameReplayService() : isModeReplayActivated = false;
  bool isModeReplayActivated;

  void activateReplayMode() {
    isModeReplayActivated = true;
    notifyListeners();
  }

  void resetForNextGame() {
    isModeReplayActivated = false;
    notifyListeners();
  }
}
