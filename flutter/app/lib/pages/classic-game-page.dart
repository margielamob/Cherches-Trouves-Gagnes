import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'dart:io';


class ImageHandler {

}


Future<ui.Image> loadImage() async {
  final File imageFile = File('path_to_your_image.jpg');
  final data = await imageFile.readAsBytes();
  return await decodeImageFromList(data);
}


SizedBox(
  width: image.width.toDouble(),
  height: image.height.toDouble(),
  child: FacePaint(
    painter: FacePainter(image),
  ),
);

class FacePainter extends CustomPainter {
  FacePainter(this.image);
  final ui.Image image;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawImage(image, Offset.zero, Paint());
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return false;
  }
}

class MyCustomPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
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

class Classic extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Classic'),
      ),
      body: Center(
        child: Stack(
          children: [
            Image.asset(
              '../assets/difference.bmp', // Replace with your image path
              width: 640, // Adjust the width and height as needed
              height: 480,
            ),
            CustomPaint(
              size: Size(200, 200), // Set the size of the custom paint
              painter: MyCustomPainter(),
            ),
          ],
        ),
      ),
    );
  }
}
