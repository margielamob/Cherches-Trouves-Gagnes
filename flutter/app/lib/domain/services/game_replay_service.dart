import 'dart:async';

import 'package:app/domain/models/game_event.dart';
import 'package:app/domain/models/replay_bar_model.dart';
import 'package:app/domain/models/requests/difference_found_message.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class GameReplayService extends ChangeNotifier {
  DifferenceDetectionService _differenceDetectionService = Get.find();
  SocketService _socket = Get.find();
  ReplayBar replayBar = Get.find();

  bool isModeReplayActivated = false;
  List<GameEvent> gameEvents = [];

  int beginGameTimeMilliSeconds = 0;
  int endGameTimeMilliSeconds = 0;
  int currentTimeMs = 0;

  Timer? timer;

  GameReplayService() {
    listenToEvents();
  }

  void handlePlayButton() {
    if (replayBar.currentProgression == replayBar.defaultEnd) return;
    _toggleIcon();
    if (replayBar.isPlaying) {
      play();
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

  void play() {
    final duration = endGameTimeMilliSeconds - beginGameTimeMilliSeconds;
    const timeIntervalMs = 200;
    timer = Timer.periodic(Duration(milliseconds: 200), (timer) {
      currentTimeMs = currentTimeMs + timeIntervalMs;
      for (var event in gameEvents) {
        if (_didEventHappen(event, timeIntervalMs)) {
          event.execute();
        }
      }
      updateCurrentProgression(currentTimeMs / duration);
    });
  }

  bool _didEventHappen(GameEvent event, int timeIntervalMs) {
    return event.relativeTimeStampMs < currentTimeMs &&
        event.relativeTimeStampMs >= currentTimeMs - timeIntervalMs;
  }

  void replay() {
    _resetForReplay();
    notifyListeners();
  }

  void updateCurrentProgression(double percentageOfProgression) {
    if (percentageOfProgression >= replayBar.defaultEnd) {
      replayBar.currentProgression = replayBar.defaultEnd;
      pause();
      _toggleIcon();
      notifyListeners();
      return;
    }
    replayBar.currentProgression = percentageOfProgression;
    notifyListeners();
  }

  void updateSelectedSpeed(int index) {
    if (replayBar.selectedSpeed[index]) return;
    _resetForReplay();
    replayBar.selectedSpeed = [false, false, false, false];
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
  }

  void activateReplayMode() {
    _differenceDetectionService.coordinates = [];
    isModeReplayActivated = true;
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
  }

  void resetForNextGame() {
    _differenceDetectionService.resetForNextGame();
    isModeReplayActivated = false;
    gameEvents = [];
    beginGameTimeMilliSeconds = 0;
    endGameTimeMilliSeconds = 0;
    currentTimeMs = 0;
    replayBar.currentProgression = 0;
    replayBar.isPlaying = false;
    replayBar.currentIcon = Icon(Icons.play_arrow);
    notifyListeners();
  }

  void _resetForReplay() {
    _differenceDetectionService.resetForNextGame();
    pause();
    currentTimeMs = 0;
    replayBar.currentProgression = 0;
    replayBar.isPlaying = false;
    replayBar.currentIcon = Icon(Icons.play_arrow);
  }
}
