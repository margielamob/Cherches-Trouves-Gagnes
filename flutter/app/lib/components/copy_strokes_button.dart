import 'package:app/domain/services/drawing_service_left.dart';
import 'package:app/domain/services/drawing_service_right.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CopyStrokesButton extends StatelessWidget {
  final DrawingServiceLeft drawingServiceLeft = Get.find();
  final DrawingServiceRight drawingServiceRight = Get.find();
  final bool shouldCopyRight;
  final bool shouldCopyLeft;

  CopyStrokesButton(
      {required this.shouldCopyRight, required this.shouldCopyLeft});

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: () {
        if (shouldCopyRight) {
          drawingServiceLeft.copyStrokes(drawingServiceRight);
        }
        if (shouldCopyLeft) {
          drawingServiceRight.copyStrokes(drawingServiceLeft);
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Icon(Icons.copy_all),
          SizedBox(width: 8.0),
        ],
      ),
    );
  }
}
