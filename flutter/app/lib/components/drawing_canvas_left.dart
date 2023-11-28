import 'package:app/components/drawing_canvas.dart';
import 'package:app/domain/services/drawing_service.dart';
import 'package:app/domain/services/drawing_service_left.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

class _CanvasPainterLeft extends CustomPainter {
  final DrawingService drawingService;
  _CanvasPainterLeft(this.drawingService);

  @override
  void paint(Canvas canvas, Size size) {
    drawingService.showDrawing(canvas, size, false, false);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class _CanvasBackgroundPainterLeft extends CustomPainter {
  final DrawingServiceLeft drawingServiceLeft = Get.find();
  @override
  void paint(Canvas canvas, Size size) {
    final backgroundImage = drawingServiceLeft.background;
    if (backgroundImage == null) return;
    canvas.scale(
        DrawingCanvas.tabletScalingRatio, DrawingCanvas.tabletScalingRatio);
    canvas.drawImage(backgroundImage, Offset.zero, Paint());
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}

class DrawingCanvasLeft extends DrawingCanvas {
  @override
  Widget build(BuildContext context) {
    final drawService = Provider.of<DrawingServiceLeft>(context);
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

              drawService.tap(details);
              print("onTapUp");
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
                painter: _CanvasBackgroundPainterLeft(),
                foregroundPainter: _CanvasPainterLeft(drawService),
              ),
            ),
          ),
        ),
        Obx(
          () => Text("Coordinate x : ${x.value}, y : ${y.value}"),
        ),
      ],
    );
  }
}
