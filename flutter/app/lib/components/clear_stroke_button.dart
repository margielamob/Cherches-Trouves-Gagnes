import 'package:app/domain/services/drawing_service_left.dart';
import 'package:app/domain/services/drawing_service_right.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ClearStrokeButton extends StatelessWidget {
  final DrawingServiceLeft drawingServiceLeft = Get.find();
  final DrawingServiceRight drawingServiceRight = Get.find();
  final bool shouldRemoveRight;
  final bool shouldRemoveLeft;

  ClearStrokeButton(
      {required this.shouldRemoveRight, required this.shouldRemoveLeft});

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: () {
        if (shouldRemoveLeft && shouldRemoveRight) {
          drawingServiceLeft.clearStrokes();
          drawingServiceRight.clearStrokes();
        }
        if (shouldRemoveRight) {
          drawingServiceRight.clearStrokes();
        }
        if (shouldRemoveLeft) {
          drawingServiceLeft.clearStrokes();
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Icon(Icons.layers_clear),
        ],
      ),
    );
  }
}
