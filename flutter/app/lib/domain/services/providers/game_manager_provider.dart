import 'package:app/domain/models/game_mode_model.dart';
import 'package:app/domain/models/waiting_game_model.dart';
import 'package:flutter/foundation.dart';

class GameManagerProvider extends ChangeNotifier {
  WaitingGameModel? _waitingGame;

  WaitingGameModel? get waitingGame => _waitingGame;

  void updateWaitingGame(WaitingGameModel data) {
    _waitingGame = data;
    notifyListeners();
  }

  bool isGameJoinable(String gameId, GameModeModel gameMode) {
    if (waitingGame == null) return false;

    List<String> currentGames = waitingGame!.gamesWaiting;
    for (var game in currentGames) {
      if (game == gameId) return true;
    }
    return false;
  }
}
