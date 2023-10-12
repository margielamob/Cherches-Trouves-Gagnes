import 'dart:typed_data';
import 'dart:ui' as ui;
import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class FacePainter extends CustomPainter {
  FacePainter(this.image);
  final ui.Image image;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawImage(image, Offset.zero, Paint());
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

class Classic extends StatelessWidget {
  Future<ui.Image> loadImage() async {
    final ByteData data = await rootBundle.load('difference.bmp');
    final Uint8List uint8List = data.buffer.asUint8List();
    final Completer<ui.Image> completer = Completer<ui.Image>();
    ui.decodeImageFromList(uint8List, (ui.Image img) {
      completer.complete(img);
    });
    return completer.future;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Classic'),
      ),
      body: Center(
        child: FutureBuilder<ui.Image>(
          future: loadImage(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              final image = snapshot.data;
              if (image != null) {
                return SizedBox(
                  width: image.width.toDouble(),
                  height: image.height.toDouble(),
                  child: FacePaint(image),
                );
              }
            }
            return CircularProgressIndicator();
          },
        ),
      ),
    );
  }
}
