abstract class NumericSlider {
  double minimum = 0;
  double maximum = 1;
  double currentProgression = 0;

  void updateProgression(double progression);
  double getValue();
}
