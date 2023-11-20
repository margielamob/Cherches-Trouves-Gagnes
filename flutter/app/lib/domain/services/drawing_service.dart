import 'package:app/domain/utils/vec2.dart';
import 'package:flutter/material.dart';

class Stroke {
  List<Vec2> coordinates = [];

  void addCoordinate(
      {DragStartDetails? startDetails, DragUpdateDetails? updateDetails}) {
    if (startDetails != null) {
      coordinates.add(
        Vec2(
          x: startDetails.localPosition.dx.round(),
          y: startDetails.localPosition.dy.round(),
        ),
      );
    } else if (updateDetails != null) {
      coordinates.add(
        Vec2(
          x: updateDetails.localPosition.dx.round(),
          y: updateDetails.localPosition.dy.round(),
        ),
      );
    }
  }
}

class DrawingService extends ChangeNotifier {
  List<Stroke> strokes = [];
  Paint defaultBlinkingColor = Paint()
    ..color = Colors.yellow
    ..style = PaintingStyle.fill;

  void tap(TapUpDetails details) {
    /*
    coordinates.add(Vec2(
        x: details.localPosition.dx.round(),
        y: details.localPosition.dy.round()));
    notifyListeners();
    */
  }

  void beginDrag(DragStartDetails details) {
    final newStroke = Stroke();
    strokes.add(newStroke);
  }

  void onDrag(DragUpdateDetails details) {
    final lastStroke = strokes.last;
    lastStroke.addCoordinate(updateDetails: details);
    notifyListeners();
  }

  void endDrag(DragEndDetails details) {}
}
