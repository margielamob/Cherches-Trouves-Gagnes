import 'package:app/components/drawing_canvas_left.dart';
import 'package:app/components/drawing_canvas_right.dart';
import 'package:app/components/generate_difference_button.dart';
import 'package:app/components/menu_between_canvas.dart';
import 'package:app/components/menu_under_canvas_left.dart';
import 'package:app/components/menu_under_canvas_right.dart';
import 'package:app/components/pencil_box.dart';
import 'package:app/components/submission_box_new_drawing.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class CreateGamePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.createGamePage),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              GenerateDifferencesButton(),
              SizedBox(
                width: 75,
              ),
            ],
          ),
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Column(
                children: [
                  DrawingCanvasLeft(),
                  MenuUnderCanvasLeft(),
                ],
              ),
              SizedBox(width: 20),
              MenuBetweenCanvas(),
              SizedBox(width: 20),
              Column(
                children: [
                  DrawingCanvasRight(),
                  MenuUnderCanvasRight(),
                ],
              ),
            ],
          ),
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(left: 230),
                  child: PencilBox(),
                ),
              ),
              SubmissionBoxNewDrawing(),
              SizedBox(width: 25),
            ],
          ),
          SizedBox(height: 40),
        ],
      ),
    );
  }
}
