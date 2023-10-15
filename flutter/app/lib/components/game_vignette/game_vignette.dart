import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:convert';
import 'dart:typed_data';

class _GameVignettePainter extends CustomPainter {
  _GameVignettePainter(this.image);
  final ui.Image image;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawImage(image, Offset.zero, Paint());
    final paint = Paint()
      ..color = Colors.purple
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
  final Uint8List image;

  Future<ui.Image> convertFromUint8ListToImage() async {
    final codec = await ui.instantiateImageCodec(image);
    final frameInfo = await codec.getNextFrame();
    final ui.Image uiImage = frameInfo.image;
    return uiImage;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: decodedImage.width.toDouble(),
      height: decodedImage.height.toDouble(),
      child: CustomPaint(painter: _GameVignettePainter(decodedImage)),
    );
  }
}
