import 'dart:ui' as ui;
import 'package:flutter/material.dart';

class FacePainter extends CustomPainter {
  FacePainter(this.image);
  final ui.Image image;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawImage(image, Offset.zero, Paint());
    final paint = Paint()
      ..color = Colors.red
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

class FacePaint extends StatelessWidget {
  final ui.Image image;

  FacePaint(this.image);

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: FacePainter(image),
    );
  }
}
