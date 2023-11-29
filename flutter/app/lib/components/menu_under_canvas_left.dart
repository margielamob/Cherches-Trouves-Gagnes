import 'package:app/components/clear_stroke_button.dart';
import 'package:app/components/copy_strokes_button.dart';
import 'package:app/components/remove_background_button.dart';
import 'package:app/components/select_background_button.dart';
import 'package:flutter/material.dart';

class MenuUnderCanvasLeft extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        ClearStrokeButton(shouldRemoveRight: false, shouldRemoveLeft: true),
        SizedBox(width: 50),
        CopyStrokesButton(shouldCopyLeft: false, shouldCopyRight: true),
        SizedBox(width: 50),
        SelectBackGroundButton(shouldDrawRight: false, shouldDrawLeft: true),
        SizedBox(width: 50),
        RemoveBackgroundButton(shouldRemoveRight: false, shouldRemoveLeft: true)
      ],
    );
  }
}
