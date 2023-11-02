import 'package:app/domain/models/vignettes_model.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

abstract class GameVignette extends StatelessWidget {
  final VignettesModel images;

  static const double tabletScalingRatio = 0.8;

  GameVignette(this.images);

  final RxDouble x = 0.0.obs;
  final RxDouble y = 0.0.obs;
}
