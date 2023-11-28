import 'package:app/components/clear_stroke_button.dart';
import 'package:app/components/copy_strokes_button.dart';
import 'package:app/components/remove_background_button.dart';
import 'package:app/components/select_background_button.dart';
import 'package:flutter/material.dart';

class MenuUnderCanvasRight extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        ClearStrokeButton(shouldRemoveRight: true, shouldRemoveLeft: false),
        SizedBox(width: 50),
        CopyStrokesButton(shouldCopyLeft: true, shouldCopyRight: false),
        SizedBox(width: 50),
        SelectBackGroundButton(shouldDrawRight: true, shouldDrawLeft: false),
        SizedBox(width: 50),
        RemoveBackgroundButton(shouldRemoveRight: true, shouldRemoveLeft: false)
      ],
    );
  }
}
