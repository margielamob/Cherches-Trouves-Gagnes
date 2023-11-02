import 'package:app/components/game_vignette.dart';
import 'package:app/domain/models/vignettes_model.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/utils/test_data.dart';
import 'package:app/domain/utils/vec2.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class _BackgroundPainter extends CustomPainter {
  final VignettesModel images;

  _BackgroundPainter(this.images);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(
        GameVignette.tabletScalingRatio, GameVignette.tabletScalingRatio);
    canvas.drawImage(images.original, Offset.zero, Paint());
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return false;
  }
}

class _ForegroundPainter extends CustomPainter {
  final DifferenceDetectionService diffService = Get.find();
  final VignettesModel images;
  List<Vec2> coordinates = TestData.coordinates;

  _ForegroundPainter(this.images);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(
        GameVignette.tabletScalingRatio, GameVignette.tabletScalingRatio);
    final path = Path();
    for (var coord in coordinates) {
      path.addRect(Rect.fromPoints(
          Offset(coord.x, coord.y), Offset(coord.x + 1, coord.y + 1)));
    }
    canvas.clipPath(path);
    canvas.drawImage(images.modified, Offset.zero, Paint());
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return true;
  }
}

class GameVignetteOriginal extends GameVignette {
  GameVignetteOriginal(images) : super(images);

  @override
  Widget build(BuildContext context) {
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
                  GameVignette.tabletScalingRatio;
              y.value = details.localPosition.dy.toDouble() /
                  GameVignette.tabletScalingRatio;
            },
            child: SizedBox(
              width: images.original.width.toDouble() *
                  GameVignette.tabletScalingRatio,
              height: images.original.height.toDouble() *
                  GameVignette.tabletScalingRatio,
              child: CustomPaint(
                painter: _BackgroundPainter(images),
                foregroundPainter: _ForegroundPainter(images),
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
