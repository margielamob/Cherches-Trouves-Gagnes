import 'dart:async';

import 'package:app/domain/models/game_event.dart';
import 'package:app/domain/models/replay_bar_model.dart';
import 'package:app/domain/models/requests/difference_found_message.dart';
import 'package:app/domain/services/clock_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/global_variables.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class GameReplayService extends ChangeNotifier {
  GlobalVariables global = Get.find();
  ClockService clockService = Get.find();
  DifferenceDetectionService _differenceDetectionService = Get.find();
  GameManagerService _gameManagerService = Get.find();
  SocketService _socket = Get.find();
  ReplayBar replayBar = Get.find();

  List<GameEvent> gameEvents = [];

  int beginGameTimeMilliSeconds = 0;
  int endGameTimeMilliSeconds = 0;
  int currentTimeMs = 0;

  int duration = 0;

  bool isTimerInit = false;
  int initTime = 0;

  Timer? timer;

  GameReplayService() {
    listenToEvents();
  }

  void handlePlayButton() {
    if (replayBar.currentProgression == replayBar.defaultEnd) return;
    _toggleIcon();
    if (replayBar.isPlaying) {
      _play();
    } else {
      pause();
    }
    notifyListeners();
  }

  void _toggleIcon() {
    replayBar.isPlaying = !replayBar.isPlaying;
    replayBar.currentIcon =
        replayBar.isPlaying ? Icon(Icons.pause) : Icon(Icons.play_arrow);
  }

  void pause() {
    timer?.cancel();
  }

  void handleOnChangeStart() {
    if (!replayBar.isPlaying) return;
    pause();
  }

  void playFrom(double percentage) {
    _updateCurrentTime(percentage);
    _executeAllPreviousCommands();
    if (!replayBar.isPlaying) return;
    _play();
  }

  void _play() {
    const refreshRateMs = 200;
    timer = Timer.periodic(Duration(milliseconds: refreshRateMs), (timer) {
      final timeSpan = (refreshRateMs * replayBar.getSpeed()).round();
      currentTimeMs = currentTimeMs + timeSpan;
      for (var event in gameEvents) {
        if (_didEventHappen(event, timeSpan)) {
          event.execute();
        }
      }
      _updateCurrentProgression(currentTimeMs / duration);
    });
  }

  void _updateCurrentTime(double percentage) {
    currentTimeMs = (duration * percentage).round();
  }

  bool _didEventHappen(GameEvent event, int timeIntervalMs) {
    return event.relativeTimeStampMs < currentTimeMs &&
        event.relativeTimeStampMs >= currentTimeMs - timeIntervalMs;
  }

  void replay() {
    _resetForReplay();
    notifyListeners();
  }

  void updateProgressBarUI(
      double percentageOfProgression, bool shouldUpdateUI) {
    replayBar.currentProgression = percentageOfProgression;
    _updateClock(percentageOfProgression);
    if (shouldUpdateUI) notifyListeners();
  }

  void _updateCurrentProgression(double percentageOfProgression) {
    if (_replayIsFinished(percentageOfProgression)) {
      updateProgressBarUI(replayBar.defaultEnd, false);
      pause();
      _toggleIcon();
      notifyListeners();
      return;
    }
    updateProgressBarUI(percentageOfProgression, false);
    _updateCurrentTime(percentageOfProgression);
    notifyListeners();
  }

  void _updateClock(double percentageOfProgression) {
    final time = initTime - (duration * percentageOfProgression / 1000).floor();
    clockService.updateTime(time);
  }

  void _executeAllPreviousCommands() {
    _gameManagerService.resetAllPlayersNbDifference();
    _differenceDetectionService.resetForNextGame();
    for (var event in gameEvents) {
      if (_didEventHappenBefore(event)) {
        event.execute();
      }
    }
  }

  bool _didEventHappenBefore(GameEvent event) {
    return event.relativeTimeStampMs < currentTimeMs;
  }

  bool _replayIsFinished(double percentageOfProgression) {
    return percentageOfProgression >= replayBar.defaultEnd;
  }

  void updateSelectedSpeed(int index) {
    if (replayBar.selectedSpeed[index]) return;
    _resetForReplay();
    replayBar.selectedSpeed = [false, false, false];
    replayBar.selectedSpeed[index] = true;
    notifyListeners();
  }

  void addStartGameEvent() {
    final event = GameStartedEvent(timeStamp: DateTime.now());
    gameEvents.add(event);
  }

  void addEndGameEvent(bool isGameWon) {
    final event = GameEndEvent(timeStamp: DateTime.now());
    gameEvents.add(event);
  }

  void listenToEvents() {
    _socket.on(SocketEvent.differenceFound, (dynamic message) {
      DifferenceFoundMessage data = DifferenceFoundMessage.fromJson(message);
      final event =
          DifferenceFoundEvent(timeStamp: DateTime.now(), differenceData: data);
      gameEvents.add(event);
    });
    _socket.on(SocketEvent.differenceNotFound, (dynamic message) {
      final event = DifferenceNotFoundEvent(timeStamp: DateTime.now());
      gameEvents.add(event);
    });
    _socket.on(SocketEvent.win, (dynamic message) {
      addEndGameEvent(true);
    });
    _socket.on(SocketEvent.lose, (dynamic message) {
      addEndGameEvent(false);
    });
    _socket.on(SocketEvent.gameStarted, (dynamic message) {
      addStartGameEvent();
    });
    _socket.on(SocketEvent.clock, (dynamic message) {
      if (!isTimerInit) {
        initTime = message + 1;
        isTimerInit = true;
      }
    });
  }

  void activateReplayMode() {
    _differenceDetectionService.coordinates = [];
    global.isModeReplayActivated = true;
    _initGameTimes();
    _setRelativeTimeStamp();
    notifyListeners();
  }

  void _setRelativeTimeStamp() {
    final firstEvent = gameEvents.first;
    for (var event in gameEvents) {
      Duration delay = event.timeStamp.difference(firstEvent.timeStamp);
      event.relativeTimeStampMs = delay.inMilliseconds;
    }
  }

  void _initGameTimes() {
    if (gameEvents.isEmpty) return;
    final firstEvent = gameEvents.first;
    final lastEvent = gameEvents.last;
    Duration delay = firstEvent.timeStamp.difference(lastEvent.timeStamp);
    beginGameTimeMilliSeconds = delay.inMilliseconds + endGameTimeMilliSeconds;
    duration = endGameTimeMilliSeconds - beginGameTimeMilliSeconds;
  }

  void resetForNextGame() {
    isTimerInit = false;
    initTime = 0;
    _gameManagerService.resetAllPlayersNbDifference();
    _differenceDetectionService.resetForNextGame();
    global.isModeReplayActivated = false;
    gameEvents = [];
    beginGameTimeMilliSeconds = 0;
    endGameTimeMilliSeconds = 0;
    duration = 0;
    currentTimeMs = 0;
    replayBar.currentProgression = 0;
    replayBar.isPlaying = false;
    replayBar.currentIcon = Icon(Icons.play_arrow);
    replayBar.selectedSpeed = [false, true, false];
    notifyListeners();
  }

  void _resetForReplay() {
    _updateCurrentProgression(0);
    _gameManagerService.resetAllPlayersNbDifference();
    _differenceDetectionService.resetForNextGame();
    pause();
    currentTimeMs = 0;
    replayBar.currentProgression = 0;
    replayBar.isPlaying = false;
    replayBar.currentIcon = Icon(Icons.play_arrow);
  }
}
