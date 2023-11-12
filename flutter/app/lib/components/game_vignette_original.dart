import 'package:app/components/game_vignette.dart';
import 'package:app/domain/models/vignettes_model.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/sound_service.dart';
import 'package:app/domain/utils/vec2.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';

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
  final DifferenceDetectionService diffService;
  final VignettesModel images;

  _ForegroundPainter(this.images, this.diffService);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(
        GameVignette.tabletScalingRatio, GameVignette.tabletScalingRatio);

    final path = Path();
    for (var coord in diffService.coordinates) {
      path.addRect(Rect.fromPoints(
          Offset(coord.x.toDouble(), coord.y.toDouble()),
          Offset(coord.x + 1, coord.y + 1)));
    }
    canvas.clipPath(path);
    canvas.drawImage(images.modified, Offset.zero, Paint());

    if (diffService.blinkingDifference != null) {
      canvas.drawPath(
          diffService.blinkingDifference!, diffService.defaultBlinkingColor);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return true;
  }
}

class GameVignetteOriginal extends GameVignette {
  GameVignetteOriginal(images, this.gameId) : super(images);
  final DifferenceDetectionService diffService = Get.find();
  final SoundService soundService = Get.find();
  final String gameId;

  @override
  Widget build(BuildContext context) {
    final diffService = Provider.of<DifferenceDetectionService>(context);

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
              diffService.validate(
                  Vec2(x: x.value.toInt(), y: y.value.toInt()), gameId, true);
            },
            child: SizedBox(
              width: images.original.width.toDouble() *
                  GameVignette.tabletScalingRatio,
              height: images.original.height.toDouble() *
                  GameVignette.tabletScalingRatio,
              child: CustomPaint(
                painter: _BackgroundPainter(images),
                foregroundPainter: _ForegroundPainter(images, diffService),
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
