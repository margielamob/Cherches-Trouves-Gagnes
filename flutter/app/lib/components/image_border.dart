import 'package:app/components/game_vignette.dart';
import 'package:flutter/material.dart';

class ImageBorder extends StatelessWidget {
  final SizedBox? sizeBoxChild;
  final GameVignette? vignette;
  final Color color;
  final double width;

  ImageBorder.forSizeBox(
      {required this.color, required this.sizeBoxChild, required this.width})
      : vignette = null;

  ImageBorder.forVignette(
      {required this.color, required this.vignette, required this.width})
      : sizeBoxChild = null;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(
          color: color,
          width: width,
        ),
      ),
      child: sizeBoxChild ?? vignette,
    );
  }
}
