import 'dart:ui' as ui;
import 'package:flutter/material.dart';

class _GameVignettePainter extends CustomPainter {
  _GameVignettePainter(this.image);
  final ui.Image image;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawImage(image, Offset.zero, Paint());
    final paint = Paint()
      ..color = Colors.orange
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 5.0;

    final center = Offset(size.width / 2, size.height / 2);
    canvas.drawCircle(center, 50, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return false;
  }
}

class GameVignette extends StatelessWidget {
  GameVignette(this.image);
  final ui.Image image;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: image.width.toDouble(),
      height: image.height.toDouble(),
      child: CustomPaint(painter: _GameVignettePainter(image)),
    );
  }
}
