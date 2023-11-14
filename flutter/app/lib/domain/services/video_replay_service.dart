import 'package:flutter/material.dart';

class VideoReplayService extends ChangeNotifier {
  double currentTime = 0;
  double beginTime = 0;
  double endTime = 100;
  bool isPlaying = false;
  Icon currentIcon = Icon(Icons.play_arrow);

  List<bool> selectedSpeed = [false, true, false, false];

  VideoReplayService() {
    _resetVideoPlayer();
  }

  void updateCurrentTime(double currentTime) {
    this.currentTime = currentTime;
    notifyListeners();
  }

  void play() {
    isPlaying = !isPlaying;
    currentIcon = isPlaying ? Icon(Icons.pause) : Icon(Icons.play_arrow);
    notifyListeners();
  }

  void replay() {
    _resetVideoPlayer();
  }

  void updateSelectedSpeed(int index) {
    if (selectedSpeed[index]) return;
    _resetVideoPlayer();
    selectedSpeed = [false, false, false, false];
    selectedSpeed[index] = true;
    notifyListeners();
  }

  void _resetVideoPlayer() {
    isPlaying = false;
    currentIcon = Icon(Icons.play_arrow);
    currentTime = 0;
    notifyListeners();
  }
}
