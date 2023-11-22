import 'package:app/components/drawing_canvas.dart';
import 'package:app/domain/services/drawing_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class _CanvasForegroundPainterRight extends CustomPainter {
  final DrawingService drawingService;
  _CanvasForegroundPainterRight(this.drawingService);

  @override
  void paint(Canvas canvas, Size size) {
    Paint paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    for (var stroke in drawingService.strokes) {
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

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class _CanvasBackgroundPainterRight extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {}

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return false;
  }
}

class DrawingCanvasRight extends DrawingCanvas {
  @override
  Widget build(BuildContext context) {
    final drawService = Provider.of<DrawingService>(context);
    return Column(
      children: <Widget>[
        Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: Colors.black,
              width: 3.0,
            ),
          ),
          child: GestureDetector(
            onTapUp: (details) {
              x.value = details.localPosition.dx.toDouble() /
                  DrawingCanvas.tabletScalingRatio;
              y.value = details.localPosition.dy.toDouble() /
                  DrawingCanvas.tabletScalingRatio;

              //drawService.tap(details);
              //print("onTapUp");
            },
            onPanStart: (details) {
              print("onPanStart");
              drawService.beginDrag(details);
            },
            onPanUpdate: (details) {
              print("onPanUpdate");
              x.value = details.localPosition.dx.toDouble() /
                  DrawingCanvas.tabletScalingRatio;
              y.value = details.localPosition.dy.toDouble() /
                  DrawingCanvas.tabletScalingRatio;
              drawService.onDrag(details);
            },
            onPanEnd: (details) {
              print("onPanEnd");
              drawService.endDrag(details);
            },
            child: SizedBox(
              width:
                  DrawingCanvas.defaultWidth * DrawingCanvas.tabletScalingRatio,
              height: DrawingCanvas.defaultHeight *
                  DrawingCanvas.tabletScalingRatio,
              child: CustomPaint(
                painter: _CanvasBackgroundPainterRight(),
                foregroundPainter: _CanvasForegroundPainterRight(drawService),
              ),
            ),
          ),
        ),
        Obx(
          () => Text("Coordinate x : ${x.value}, y : ${y.value}"),
        )
      ],
    );
  }
}
