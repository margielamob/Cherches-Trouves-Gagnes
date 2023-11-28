import 'package:app/domain/services/drawing_service_left.dart';
import 'package:app/domain/services/drawing_service_right.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class RemoveBackgroundButton extends StatelessWidget {
  final DrawingServiceLeft drawingServiceLeft = Get.find();
  final DrawingServiceRight drawingServiceRight = Get.find();
  final bool shouldRemoveRight;
  final bool shouldRemoveLeft;

  RemoveBackgroundButton(
      {required this.shouldRemoveRight, required this.shouldRemoveLeft});

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: () {
        if (shouldRemoveLeft && shouldRemoveRight) {
          drawingServiceLeft.removeBackgroundImage();
          drawingServiceRight.removeBackgroundImage();
        }
        if (shouldRemoveRight) {
          drawingServiceRight.removeBackgroundImage();
        }
        if (shouldRemoveLeft) {
          drawingServiceLeft.removeBackgroundImage();
        }
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
    );
  }
}
