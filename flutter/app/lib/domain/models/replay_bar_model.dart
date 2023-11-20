import 'package:flutter/material.dart';

class ReplayBar {
  double defaultBegin = 0;
  double defaultEnd = 1;
  double currentProgression = 0;

  // x1.0, x2.0, x4.0
  List<bool> selectedSpeed = [false, true, false];

  double getSpeed() {
    if (selectedSpeed[0]) return 1.0;
    if (selectedSpeed[1]) return 2.0;
    if (selectedSpeed[2]) return 4.0;
    return 1.0;
  }

  Icon currentIcon = Icon(Icons.play_arrow);
  bool isPlaying = false;
}
