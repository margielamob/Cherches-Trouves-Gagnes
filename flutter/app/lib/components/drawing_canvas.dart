import 'package:flutter/material.dart';
import 'package:get/get.dart';

abstract class DrawingCanvas extends StatelessWidget {
  static const double tabletScalingRatio = 0.8;
  static const int defaultWidth = 640;
  static const int defaultHeight = 480;

  DrawingCanvas();


  final RxDouble x = 0.0.obs;
  final RxDouble y = 0.0.obs;
}
