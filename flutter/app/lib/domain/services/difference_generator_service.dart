import 'dart:math';

import 'package:app/components/drawing_canvas.dart';
import 'package:app/domain/services/drawing_service.dart';
import 'package:app/domain/services/drawing_service_left.dart';
import 'package:app/domain/services/drawing_service_right.dart';
import 'package:app/domain/services/generate_difference_slider_service.dart';
import 'package:app/domain/utils/vec2.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class Range {
  bool isLeftCanvas;
  int nbCoord;
  int minX;
  int minY;
  int maxX;
  int maxY;
  Range(
      {required this.isLeftCanvas,
      required this.nbCoord,
      required this.minX,
      required this.maxX,
      required this.minY,
      required this.maxY});
}

class DifferenceGeneratorService {
  var rng = Random();
  final List<Color> colors = [
    const Color.fromARGB(255, 211, 53, 41),
    const Color.fromARGB(255, 184, 21, 75),
    const Color.fromARGB(255, 127, 27, 145),
    const Color.fromARGB(255, 74, 36, 140),
    const Color.fromARGB(255, 38, 50, 122),
    const Color.fromARGB(255, 66, 87, 104),
    const Color.fromARGB(255, 27, 45, 53),
    const Color.fromARGB(255, 52, 99, 106),
    const Color.fromARGB(255, 52, 105, 99),
    const Color.fromARGB(255, 49, 98, 51),
    const Color.fromARGB(255, 178, 234, 115),
    const Color.fromARGB(255, 211, 223, 101),
    const Color.fromARGB(255, 233, 226, 162),
    const Color.fromARGB(255, 103, 83, 23),
    const Color.fromARGB(255, 142, 91, 14),
    const Color.fromARGB(255, 173, 57, 22),
    const Color.fromARGB(255, 122, 79, 64),
    Color.fromARGB(255, 92, 92, 92),
    const Color.fromARGB(255, 48, 63, 70),
    const Color.fromARGB(255, 41, 41, 41),
  ];
  final DrawingServiceLeft drawingServiceLeft = Get.find();
  final DrawingServiceRight drawingServiceRight = Get.find();
  final GenerateDifferenceSliderService differenceSliderService = Get.find();

  Color _getRandomColor() {
    try {
      return colors[rng.nextInt(colors.length)];
    } catch (error) {
      return colors[0];
    }
  }

  void generateDifferences() {
    /*
    +--------------------------+----------------------------------+
    | Besoin de 15 px minimum  | 480/2 = 240+-20, 640/2 = 320+-20 |
    +--------------------------+----------------------------------+
    | Difference 1             | Difference 2                     |
    | x_min = 0, y_min = 0     | x_min = 340, y_min = 0           |
    | x_max = 300, y_max = 220 | x_max = 640, y_max = 220         |
    +--------------------------+----------------------------------+
    | Difference 3             | Difference 4                     |
    | x_min = 0, y_min = 260   | x_min = 340, y_min = 260         |
    | x_max = 300, y_max = 480 | x_max = 680, y_max = 480         |
    +--------------------------+----------------------------------+
    */

    final nbOfDifferenceToGenerate =
        differenceSliderService.differencesSlider.getValue().round();

    switch (nbOfDifferenceToGenerate) {
      case 0:
        return;
      case 1:
        _generateOnRandomDifference(Range(
            isLeftCanvas: rng.nextBool(),
            nbCoord: rng.nextInt(20) + 1,
            minX: 0,
            maxX: 640,
            minY: 0,
            maxY: 480));
        break;
      case 2:
        if (rng.nextBool()) {
          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: 10,
              minX: 0,
              maxX: _divideWidth(2, false),
              minY: 0,
              maxY: 480));

          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: 5,
              minX: _divideWidth(2, true),
              maxX: 640,
              minY: 0,
              maxY: 480));
        } else {
          _generateOnRandomDifference(Range(
            isLeftCanvas: rng.nextBool(),
            nbCoord: 5,
            minX: 0,
            maxX: 640,
            minY: 0,
            maxY: _divideHeight(2, false),
          ));

          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: 5,
              minX: 0,
              maxX: 640,
              minY: _divideHeight(2, false),
              maxY: 480));
        }
        break;
      case 3:
        if (rng.nextBool()) {
          _generateOnRandomDifference(
            Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: 5,
              minX: 0,
              maxX: (640 / 3).round() - 16,
              minY: 0,
              maxY: 480,
            ),
          );
          _generateOnRandomDifference(
            Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: 5,
              minX: (640 / 3).round() + 16,
              maxX: (2 * (640 / 3)).round() - 16,
              minY: 0,
              maxY: 480,
            ),
          );
          _generateOnRandomDifference(
            Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: 5,
              minX: (2 * (640 / 3)).round() + 16,
              maxX: 640,
              minY: 0,
              maxY: 480,
            ),
          );
        } else {
          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: 5,
              minX: 0,
              maxX: 640,
              minY: 0,
              maxY: _divideHeight(2, false)));

          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: 5,
              minX: 0,
              maxX: _divideWidth(2, false),
              minY: _divideHeight(2, true),
              maxY: 480));

          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: 5,
              minX: _divideWidth(2, true),
              maxX: 640,
              minY: _divideHeight(2, true),
              maxY: 480));
        }
        break;
      case 4:
        if (rng.nextBool()) {
          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: rng.nextInt(20) + 1,
              minX: 0,
              maxX: (1 * (640 / 4)).round() - 16,
              minY: 0,
              maxY: 480));
          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: rng.nextInt(20) + 1,
              minX: (1 * (640 / 4)).round() + 16,
              maxX: (2 * (640 / 4)).round() - 16,
              minY: 0,
              maxY: 480));
          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: rng.nextInt(20) + 1,
              minX: (2 * (640 / 4)).round() + 16,
              maxX: (3 * (640 / 4)).round() - 16,
              minY: 0,
              maxY: 480));
          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: rng.nextInt(20) + 1,
              minX: (3 * (640 / 4)).round() + 16,
              maxX: 640,
              minY: 0,
              maxY: 480));
        } else {
          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: rng.nextInt(20) + 1,
              minY: 0,
              maxY: (1 * (480 / 4)).round() - 16,
              minX: 0,
              maxX: 480));
          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: rng.nextInt(20) + 1,
              minY: (1 * (480 / 4)).round() + 16,
              maxY: (2 * (480 / 4)).round() - 16,
              minX: 0,
              maxX: 480));
          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: rng.nextInt(20) + 1,
              minY: (2 * (480 / 4)).round() + 16,
              maxY: (3 * (480 / 4)).round() - 16,
              minX: 0,
              maxX: 480));
          _generateOnRandomDifference(Range(
              isLeftCanvas: rng.nextBool(),
              nbCoord: rng.nextInt(20) + 1,
              minY: (3 * (480 / 4)).round() + 16,
              maxY: 640,
              minX: 0,
              maxX: 480));
        }

        break;
    }
  }

  int _divideWidth(int numberOfDivision, bool isMin) {
    int value = (640 / numberOfDivision).round();
    if (isMin) {
      value = value + 16;
    } else {
      value = value - 16;
    }
    return value;
  }

  int _divideHeight(int numberOfDivision, bool isMin) {
    int value = (480 / numberOfDivision).round();
    if (isMin) {
      value = value + 16;
    } else {
      value = value - 16;
    }
    return value;
  }

  void _generateOnRandomDifference(Range range) {
    try {
      final newStroke = Stroke(_getRandomColor(), rng.nextInt(5) + 1, false);
      print("newStroke");
      List<Vec2> coordinates = _generateSingleDifference(range);
      print("coordinates");

      if (rng.nextBool()) {
        if (rng.nextBool()) {
          coordinates.sort((a, b) => a.x.compareTo(b.x));
        } else {
          coordinates.sort((a, b) => a.y.compareTo(b.y));
        }
      }

      _convertsStrokesToRatio(coordinates);
      newStroke.addCoordinate(randomCoordinates: coordinates);
      print("begin");
      if (range.isLeftCanvas) {
        print("add stroke left service");
        drawingServiceLeft.addStrokes(newStroke);
      } else {
        print("add stroke right service");
        drawingServiceRight.addStrokes(newStroke);
      }
    } catch (error) {
      print("error $error");
    }
  }

  List<Vec2> _generateSingleDifference(Range range) {
    print("_generateSingleDifference");
    List<Vec2> newCoordinates = [];

    final randomNb = rng.nextInt(range.nbCoord) + 5;
    for (int i = 0; i < randomNb; i++) {
      var tmpX = (rng.nextInt(range.maxX - range.minX) + 1) + range.minX;
      var valueX = tmpX >= 0 && tmpX <= 640 ? tmpX : -1;

      var tmpY = (rng.nextInt(range.maxY - range.minY) + 1) + range.minY;
      var valueY = tmpX >= 0 && tmpY <= 480 ? tmpY : -1;

      if (valueY != -1 && valueX != -1) {
        newCoordinates.add(Vec2(x: valueX, y: valueY));
      }
    }

    return newCoordinates;
  }

  void _convertsStrokesToRatio(List<Vec2> currentStrokes) {
    for (var stroke in currentStrokes) {
      stroke.x = (stroke.x * DrawingCanvas.tabletScalingRatio).round();
      stroke.y = (stroke.y * DrawingCanvas.tabletScalingRatio).round();
    }
  }
}
