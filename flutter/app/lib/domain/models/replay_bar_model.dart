import 'package:flutter/material.dart';

class ReplayBar {
  double defaultBegin = 0;
  double defaultEnd = 1;
  double currentProgression = 0;

  // x0.5, x1.0, x2.0, x3.0
  List<bool> selectedSpeed = [false, true, false, false];

  double getSpeed() {
    if (selectedSpeed[0]) return 0.5;
    if (selectedSpeed[1]) return 1.0;
    if (selectedSpeed[2]) return 2.0;
    if (selectedSpeed[3]) return 3.0;
    return 1.0;
  }

  Icon currentIcon = Icon(Icons.play_arrow);
  bool isPlaying = false;
}
