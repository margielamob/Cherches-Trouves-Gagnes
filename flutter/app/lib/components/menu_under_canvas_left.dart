import 'package:app/domain/services/drawing_service_left.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MenuUnderCanvasLeft extends StatelessWidget {
  final DrawingServiceLeft drawingServiceLeft = Get.find();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        FilledButton(
          onPressed: () {
            drawingServiceLeft.clearStrokes();
          },
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Icon(Icons.layers_clear),
            ],
          ),
        ),
        SizedBox(width: 50),
        FilledButton(
          onPressed: () {
            drawingServiceLeft.setBackgroundImage();
          },
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Icon(Icons.image),
            ],
          ),
        ),
        SizedBox(width: 50),
        FilledButton(
          onPressed: () {
            drawingServiceLeft.removeBackgroundImage();
          },
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Image.asset(
                'assets/image_not_working.png',
                width: 22.0,
                height: 22.0,
              ),
              SizedBox(width: 8.0),
            ],
          ),
        ),
      ],
    );
  }
}
