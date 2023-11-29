import 'package:app/domain/services/pencil_service.dart';
import 'package:app/domain/utils/numeric_slider.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class PencilSizeSlider extends NumericSlider {
  @override
  void updateProgression(double progression) {
    if (progression < 0.25) {
      currentProgression = 0;
    } else if (progression < 0.5) {
      currentProgression = 0.25;
    } else if (progression < 0.75) {
      currentProgression = 0.5;
    } else if (progression < 1.0) {
      currentProgression = 0.75;
    } else {
      currentProgression = 1.0;
    }
  }

  @override
  double getValue() {
    if (currentProgression == 0.0) return 2.0;
    if (currentProgression == 0.25) return 2.5;
    if (currentProgression == 0.5) return 3.0;
    if (currentProgression == 0.75) return 3.5;
    if (currentProgression == 1.0) return 4.0;
    return 1.0;
  }
}

class PencilBoxManager extends ChangeNotifier {
  final PencilService pencilService = Get.find();
  Color buttonSelectionColor = Color.fromARGB(255, 182, 166, 28);

  PencilSizeSlider pencilSizeSlider = PencilSizeSlider();

  void resetForNewDrawing() {
    changeColor(Colors.blue);
    updateProgression(0);
    selectPencil();
  }

  void changeColor(Color color) {
    pencilService.currentColor = color;
  }

  void changeColors(List<Color> colors) {
    pencilService.currentColors = colors;
  }

  void selectEraser() {
    pencilService.currentTool = DrawingTool.eraser;
    updateStrokeWidth();
    notifyListeners();
  }

  void selectPencil() {
    pencilService.currentTool = DrawingTool.pencil;
    updateStrokeWidth();
    notifyListeners();
  }

  bool isPencilSelected() {
    return pencilService.currentTool == DrawingTool.pencil;
  }

  bool isEraserSelected() {
    return pencilService.currentTool == DrawingTool.eraser;
  }

  void updateProgression(double progression) {
    pencilSizeSlider.updateProgression(progression);
    updateStrokeWidth();
    notifyListeners();
  }

  void updateStrokeWidth() {
    double sliderValue = pencilSizeSlider.getValue();
    if (pencilService.currentTool == DrawingTool.eraser) {
      pencilService.currentStrokeWidth = sliderValue * 2;
    } else {
      pencilService.currentStrokeWidth = sliderValue;
    }
  }
}
