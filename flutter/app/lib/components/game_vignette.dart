import 'package:app/domain/models/vignettes_model.dart';
import 'package:flutter/material.dart';

class _GameVignettePainter extends CustomPainter {
  final VignettesModel images;
  final List<Offset> pixelCoordinates;

  _GameVignettePainter(this.images, this.pixelCoordinates);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawImage(images.original, Offset.zero, Paint());
    canvas.clipRect(Rect.fromPoints(Offset(50.0, 50.0), Offset(150.0, 150.0)));
    canvas.drawImage(images.modified, Offset.zero, Paint());
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return false;
  }
}

class GameVignette extends StatelessWidget {
  final VignettesModel images;
  final List<Offset> pixelCoordinates;

  GameVignette(this.images, this.pixelCoordinates);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: images.original.width.toDouble(),
      height: images.original.height.toDouble(),
      child: CustomPaint(
        painter: _GameVignettePainter(images, pixelCoordinates),
      ),
    );
  }
}
