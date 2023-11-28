import 'dart:ui' as ui;
import 'dart:ui';

import 'package:app/components/drawing_canvas.dart';
import 'package:app/domain/services/image_selection_service.dart';
import 'package:app/domain/services/pencil_service.dart';
import 'package:app/domain/utils/vec2.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:image/image.dart' as image;

class Stroke {
  List<Vec2> coordinates = [];

  Paint paint;

  Stroke(Color color, double strokeWidth, bool isEraser)
      : paint = Paint()
          ..color = color
          ..strokeWidth = strokeWidth
          ..style = PaintingStyle.stroke
          ..blendMode = isEraser ? BlendMode.clear : BlendMode.srcOver;

  void addCoordinate(
      {DragStartDetails? startDetails,
      DragUpdateDetails? updateDetails,
      TapUpDetails? tapUpDetails,
      List<Vec2>? randomCoordinates}) {
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
    } else if (randomCoordinates != null) {
      coordinates.addAll(randomCoordinates);
    }
  }
}

class DrawingService extends ChangeNotifier {
  final ImageSelectionService imageSelectionService = Get.find();
  final PencilService pencil = Get.find();
  bool isSubmissionAvailable = true;
  bool wasDrawingOutsideCanvas = false;
  List<Stroke> strokes = [];
  ui.Image? background;
  Size? size;

  void changeColor(Color color) {
    pencil.currentColor = color;
  }

  void changeColors(List<Color> colors) {
    pencil.currentColors = colors;
  }

  void resetForNewDrawing() {
    isSubmissionAvailable = true;
    background = null;
    strokes = [];
  }

  void toggleSubmission() {
    isSubmissionAvailable = !isSubmissionAvailable;
    notifyListeners();
  }

  void addStrokes(Stroke stroke) {
    strokes.add(stroke);
    notifyListeners();
  }

  void copyStrokes(DrawingService drawingService) {
    strokes = [];

    for (var stroke in drawingService.strokes) {
      strokes.add(stroke);
    }
  }

  void tap(TapUpDetails details) {
    final newStroke = Stroke(
        pencil.currentColor, pencil.currentStrokeWidth, pencil.isErasing());
    newStroke.addCoordinate(tapUpDetails: details);
    strokes.add(newStroke);
    notifyListeners();
  }

  void beginDrag(DragStartDetails details) {
    if (pencil.isErasing()) {
      final newStroke = Stroke(Colors.white, pencil.currentStrokeWidth, true);
      strokes.add(newStroke);
    } else {
      final newStroke =
          Stroke(pencil.currentColor, pencil.currentStrokeWidth, false);
      strokes.add(newStroke);
    }
    notifyListeners();
  }

  void onDrag(DragUpdateDetails details) {
    final x = details.localPosition.dx;
    final y = details.localPosition.dy;

    print("x : $x, y: $y");

    if (_isStrokeInsideCanvas(x, y)) {
      if (wasDrawingOutsideCanvas) {
        final newStroke = Stroke(
            pencil.currentColor, pencil.currentStrokeWidth, pencil.isErasing());
        strokes.add(newStroke);
      } else {
        final lastStroke = strokes.last;
        lastStroke.addCoordinate(updateDetails: details);
      }
      wasDrawingOutsideCanvas = false;
    } else {
      wasDrawingOutsideCanvas = true;
    }
    notifyListeners();
  }

  bool _isStrokeInsideCanvas(double x, double y) {
    return x <= DrawingCanvas.defaultWidth * DrawingCanvas.tabletScalingRatio &&
        x >= 0 &&
        y <= DrawingCanvas.defaultHeight * DrawingCanvas.tabletScalingRatio &&
        y >= 0;
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

  Future<ui.Image?> fetchBackgroundImage() async {
    try {
      return await imageSelectionService.selectImage();
    } catch (error) {
      return null;
    }
  }

  Future<bool> setNewBackgroundImage(ui.Image? newBackground) async {
    try {
      if (newBackground == null) false;
      if (newBackground!.height > 480 || newBackground.width > 640) {
        return false;
      }
      background = newBackground;
      notifyListeners();
      return true;
    } catch (error) {
      return false;
    }
  }

  Future<bool> setBackgroundImage() async {
    try {
      ui.Image? newBackground = await imageSelectionService.selectImage();

      if (newBackground == null) false;
      if (newBackground!.height > 480 || newBackground.width > 640) {
        return false;
      }
      background = newBackground;
      notifyListeners();
      return true;
    } catch (error) {
      return false;
    }
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

  void showDrawing(Canvas canvas, Size size, bool needsToShowBackground,
      bool useRealDimensions) {
    if (background != null && needsToShowBackground) {
      canvas.drawImage(background!, Offset.zero, Paint());
    }
    canvas.saveLayer(Offset.zero & size, Paint());
    this.size = size;

    double ratio = useRealDimensions ? 1.25 : 1.0;

    for (var stroke in strokes) {
      final path = Path();

      if (stroke.coordinates.length > 1) {
        path.moveTo(stroke.coordinates[0].x.toDouble() * ratio,
            stroke.coordinates[0].y.toDouble() * ratio);

        for (int i = 1; i < stroke.coordinates.length - 1; ++i) {
          final coord0 = stroke.coordinates[i];
          final coord1 = stroke.coordinates[i + 1];

          final controlPointX = (coord0.x * ratio + coord1.x * ratio) / 2;
          final controlPointY = (coord0.y * ratio + coord1.y * ratio) / 2;

          path.quadraticBezierTo(
            coord0.x.toDouble() * ratio,
            coord0.y.toDouble() * ratio,
            controlPointX,
            controlPointY,
          );

          path.quadraticBezierTo(
            controlPointX,
            controlPointY,
            (controlPointX + coord1.x * ratio) / 2,
            (controlPointY + coord1.y * ratio) / 2,
          );
        }

        final lastPoint = stroke.coordinates.last;
        path.lineTo(
            lastPoint.x.toDouble() * ratio, lastPoint.y.toDouble() * ratio);
      }
      canvas.drawPath(path, stroke.paint);
    }
    canvas.restore();
  }

  Future<Uint8List> takeSnapShot() async {
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);

    Size size = Size(640, 480);
    _drawWhiteBackground(canvas, size);
    showDrawing(canvas, size, true, true);

    final picture = recorder.endRecording();

    final img = await picture.toImage(640, 480);

    final ByteData? byteData =
        await img.toByteData(format: ui.ImageByteFormat.rawRgba);
    return byteData!.buffer.asUint8List();
  }

  void _drawWhiteBackground(Canvas canvas, Size size) {
    final Paint paint = Paint()..color = Colors.white;
    final Rect rect =
        Rect.fromPoints(Offset(0.0, 0.0), Offset(size.width, size.height));
    canvas.drawRect(rect, paint);
  }
}
