import 'package:flutter/material.dart';

class RadiusSlider {
  double minimum = 0;
  double maximum = 1;
  double currentProgression = 0;

  void updateProgression(double progression) {
    if (progression < 0.33) {
      currentProgression = 0;
    } else if (progression < 0.66) {
      currentProgression = 0.33;
    } else if (progression < 1.0) {
      currentProgression = 0.66;
    } else {
      currentProgression = 1.0;
    }
  }

  double getEnlargementRadius() {
    if (currentProgression == 0.0) return 0.0;
    if (currentProgression == 0.33) return 3.0;
    if (currentProgression == 0.66) return 9.0;
    if (currentProgression == 1.0) return 15.0;
    return 3.0;
  }
}

class RadiusSliderService extends ChangeNotifier {
  RadiusSlider radiusSlider = RadiusSlider();

  void updateProgression(double progression) {
    radiusSlider.updateProgression(progression);
    notifyListeners();
  }
}
