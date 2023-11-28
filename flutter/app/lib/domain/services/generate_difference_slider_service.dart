import 'package:app/domain/utils/numeric_slider.dart';
import 'package:flutter/material.dart';

class DifferencesSlider extends NumericSlider {
  @override
  void updateProgression(double progression) {
    if (progression < 0.10) {
      currentProgression = 0;
    } else if (progression < 0.50) {
      currentProgression = 0.33;
    } else if (progression < 0.80) {
      currentProgression = 0.66;
    } else {
      currentProgression = 1.0;
    }
  }

  @override
  double getValue() {
    if (currentProgression == 0.0) return 1.0;
    if (currentProgression == 0.33) return 2.0;
    if (currentProgression == 0.66) return 3.0;
    if (currentProgression == 1.0) return 4.0;
    return 0;
  }
}

class GenerateDifferenceSliderService extends ChangeNotifier {
  DifferencesSlider differencesSlider = DifferencesSlider();

  void updateProgression(double progression) {
    differencesSlider.updateProgression(progression);
    notifyListeners();
  }
}
