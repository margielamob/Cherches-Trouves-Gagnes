import 'package:app/components/game_vignette.dart';
import 'package:app/domain/models/vignettes_model.dart';
import 'package:flutter/material.dart';

class _OriginalGameVignettePainter extends CustomPainter {
  final VignettesModel images;

  _OriginalGameVignettePainter(this.images);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawImage(images.original, Offset.zero, Paint());
    // TO USE WHEN WE FIND A
    // canvas.clipRect(Rect.fromPoints(Offset(50.0, 50.0), Offset(150.0, 150.0)));
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return false;
  }
}

class OriginalGameVignette extends GameVignette {
  OriginalGameVignette(VignettesModel images) : super(false, images);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: images.original.width.toDouble(),
      height: images.original.height.toDouble(),
      child: CustomPaint(
        painter: _OriginalGameVignettePainter(images),
      ),
    );
  }
}