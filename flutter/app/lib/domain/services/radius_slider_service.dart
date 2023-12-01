import 'package:app/domain/utils/numeric_slider.dart';
import 'package:flutter/material.dart';

class RadiusSlider extends NumericSlider {
  @override
  void updateProgression(double progression) {
    if (progression < 0.50) {
      currentProgression = 0;
    } else {
      currentProgression = 1.0;
    }
  }

  @override
  double getValue() {
    if (currentProgression == 0.0) return 0.0;
    if (currentProgression == 1.0) return 3.0;
    return 0.0;
  }
}

class RadiusSliderService extends ChangeNotifier {
  RadiusSlider radiusSlider = RadiusSlider();

  void updateProgression(double progression) {
    radiusSlider.updateProgression(progression);
    notifyListeners();
  }
}
