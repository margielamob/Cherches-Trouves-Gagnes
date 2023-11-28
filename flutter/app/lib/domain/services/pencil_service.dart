import 'package:flutter/material.dart';

enum DrawingTool {
  pencil,
  eraser,
}

class PencilService {
  Color currentColor = Colors.blue;
  double currentStrokeWidth = 2.0;
  List<Color> currentColors = [];
  List<Color> colorHistory = [];
  DrawingTool currentTool = DrawingTool.pencil;

  bool isErasing() {
    return currentTool == DrawingTool.eraser;
  }
}
