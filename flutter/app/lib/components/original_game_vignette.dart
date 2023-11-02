import 'package:app/components/game_vignette.dart';
import 'package:app/domain/models/vignettes_model.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/utils/vec2.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class _OriginalGameVignettePainter extends CustomPainter {
  final VignettesModel images;
  List<Vec2> coordinates;

  _OriginalGameVignettePainter(this.images, this.coordinates);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawImage(images.original, Offset.zero, Paint());
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

class OriginalGameVignette extends GameVignette {
  OriginalGameVignette(VignettesModel images) : super(false, images);

  final DifferenceDetectionService differenceDetectionService = Get.find();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          width: images.original.width.toDouble(),
          height: images.original.height.toDouble(),
          child: CustomPaint(
            painter: _OriginalGameVignettePainter(
                images, differenceDetectionService.coordinates),
          ),
        ),
        FilledButton(
          style: ButtonStyle(
            minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
          ),
          onPressed: () {
            differenceDetectionService.validate(Vec2(x: 0, y: 0), "");
          },
          child: Text("SendEmit"),
        ),
      ],
    );
  }
}
