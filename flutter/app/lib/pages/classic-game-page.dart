import 'package:flutter/material.dart';

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
