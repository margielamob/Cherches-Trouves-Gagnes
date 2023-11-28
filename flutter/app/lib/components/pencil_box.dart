import 'package:app/components/block_color_picker.dart';
import 'package:app/components/remove_background_button.dart';
import 'package:app/components/select_background_button.dart';
import 'package:app/domain/services/pencil_box_manager.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PencilBox extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final pencilBoxManager = Provider.of<PencilBoxManager>(context);

    return Center(
      child: Card(
        shadowColor: Color.fromARGB(255, 46, 46, 46),
        child: Padding(
          padding: EdgeInsets.all(8.0),
          child: SizedBox(
            height: 40,
            width: 1000,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FilledButton(
                  onPressed: () {
                    pencilBoxManager.selectPencil();
                  },
                  style: FilledButton.styleFrom(
                      backgroundColor: pencilBoxManager.isPencilSelected()
                          ? pencilBoxManager.buttonSelectionColor
                          : Theme.of(context).appBarTheme.backgroundColor),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Icon(Icons.create),
                    ],
                  ),
                ),
                SizedBox(width: 30),
                FilledButton(
                  onPressed: () {
                    pencilBoxManager.selectEraser();
                  },
                  style: FilledButton.styleFrom(
                      backgroundColor: pencilBoxManager.isEraserSelected()
                          ? pencilBoxManager.buttonSelectionColor
                          : Theme.of(context).appBarTheme.backgroundColor),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Image.asset(
                        'assets/eraser-icon-white.png',
                        width: 25.0,
                        height: 25.0,
                      ),
                      SizedBox(width: 8.0),
                    ],
                  ),
                ),
                SizedBox(width: 30),
                BlockColorPicker(
                  pickerColor: pencilBoxManager.pencilService.currentColor,
                  onColorChanged: pencilBoxManager.changeColor,
                  pickerColors: pencilBoxManager.pencilService.currentColors,
                  onColorsChanged: pencilBoxManager.changeColors,
                  colorHistory: pencilBoxManager.pencilService.colorHistory,
                ),
                SizedBox(
                  width: 200,
                  child: Slider(
                    min: pencilBoxManager.pencilSizeSlider.minimum,
                    max: pencilBoxManager.pencilSizeSlider.maximum,
                    value: pencilBoxManager.pencilSizeSlider.currentProgression,
                    onChanged: (double time) {
                      pencilBoxManager.updateProgression(time);
                    },
                  ),
                ),
                Text("${pencilBoxManager.pencilService.currentStrokeWidth} px"),
                SizedBox(width: 30),
                SelectBackGroundButton(
                    shouldDrawRight: true, shouldDrawLeft: true),
                SizedBox(width: 30),
                RemoveBackgroundButton(
                    shouldRemoveRight: true, shouldRemoveLeft: true),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
