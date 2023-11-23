import 'package:app/domain/services/drawing_service_left.dart';
import 'package:app/domain/services/drawing_service_right.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class MenuBetweenCanvas extends StatelessWidget {
  final DrawingServiceLeft drawingServiceLeft = Get.find();
  final DrawingServiceRight drawingServiceRight = Get.find();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FilledButton(
        onPressed: () {
          drawingServiceLeft.switchStrokes(drawingServiceRight);
        },
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Image.asset(
              'assets/swap-pictures-white.png',
              width: 25.0,
              height: 25.0,
            ),
            SizedBox(width: 8.0),
          ],
        ),
      ),
    );
  }
}
