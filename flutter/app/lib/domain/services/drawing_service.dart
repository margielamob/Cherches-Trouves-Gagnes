import 'dart:ui' as ui;
import 'dart:ui';

import 'package:app/domain/utils/vec2.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image/image.dart' as image;

class Stroke {
  List<Vec2> coordinates = [];

  void addCoordinate(
      {DragStartDetails? startDetails,
      DragUpdateDetails? updateDetails,
      TapUpDetails? tapUpDetails}) {
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
    } else if (tapUpDetails != null) {
      coordinates.add(
        Vec2(
          x: tapUpDetails.localPosition.dx.round(),
          y: tapUpDetails.localPosition.dy.round(),
        ),
      );
    }
  }
}

class DrawingService extends ChangeNotifier {
  bool isSubmissionAvailable = true;
  ui.Image? background;

  void toggleSubmission() {
    isSubmissionAvailable = !isSubmissionAvailable;
    notifyListeners();
  }

  List<Stroke> strokes = [];
  void tap(TapUpDetails details) {
    final newStroke = Stroke();
    newStroke.addCoordinate(tapUpDetails: details);
    strokes.add(newStroke);
    notifyListeners();
  }

  void beginDrag(DragStartDetails details) {
    final newStroke = Stroke();
    strokes.add(newStroke);
    notifyListeners();
  }

  void onDrag(DragUpdateDetails details) {
    final lastStroke = strokes.last;
    lastStroke.addCoordinate(updateDetails: details);
    notifyListeners();
  }

  void endDrag(DragEndDetails details) {}

  void switchStrokes(DrawingService drawingService) {
    final incomingStrokes = drawingService.strokes;
    final currentStrokes = strokes;
    drawingService.strokes = currentStrokes;
    strokes = incomingStrokes;
    notifyListeners();
  }

  void clearStrokes() {
    strokes = [];
    notifyListeners();
  }

  Future<void> removeBackgroundImage() async {
    background = null;
    notifyListeners();
  }

  Future<void> setBackgroundImage() async {
    background = await _getUiImage('assets/default_image.bmp', 480, 640);
    notifyListeners();
  }

  Future<ui.Image> _getUiImage(
      String imageAssetPath, int height, int width) async {
    final ByteData assetImageByteData = await rootBundle.load(imageAssetPath);
    image.Image? baseSizeImage =
        image.decodeImage(assetImageByteData.buffer.asUint8List());
    image.Image resizeImage =
        image.copyResize(baseSizeImage!, height: height, width: width);
    ui.Codec codec =
        await ui.instantiateImageCodec(image.encodePng(resizeImage));
    ui.FrameInfo frameInfo = await codec.getNextFrame();
    return frameInfo.image;
  }

  void showDrawing(Canvas canvas, bool needsToShowBackground) {
    Paint paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    if (background != null && needsToShowBackground) {
      canvas.drawImage(background!, Offset.zero, paint);
    }

    for (var stroke in strokes) {
      final path = Path();

      if (stroke.coordinates.length > 1) {
        path.moveTo(stroke.coordinates[0].x.toDouble(),
            stroke.coordinates[0].y.toDouble());

        for (int i = 1; i < stroke.coordinates.length - 1; ++i) {
          final coord0 = stroke.coordinates[i];
          final coord1 = stroke.coordinates[i + 1];

          final controlPointX = (coord0.x + coord1.x) / 2;
          final controlPointY = (coord0.y + coord1.y) / 2;

          path.quadraticBezierTo(
            coord0.x.toDouble(),
            coord0.y.toDouble(),
            controlPointX,
            controlPointY,
          );

          path.quadraticBezierTo(
            controlPointX,
            controlPointY,
            (controlPointX + coord1.x) / 2,
            (controlPointY + coord1.y) / 2,
          );
        }

        final lastPoint = stroke.coordinates.last;
        path.lineTo(lastPoint.x.toDouble(), lastPoint.y.toDouble());
      }

      canvas.drawPath(path, paint);
    }
  }

  Future<Uint8List> takeSnapShot() async {
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);

    showDrawing(canvas, true);

    final picture = recorder.endRecording();
    final img = await picture.toImage(640, 480);

    final ByteData? byteData =
        await img.toByteData(format: ui.ImageByteFormat.rawRgba);
    return byteData!.buffer.asUint8List();
  }
}
