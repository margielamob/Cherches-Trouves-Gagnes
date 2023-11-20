import 'package:app/components/drawing_canvas_left.dart';
import 'package:app/components/drawing_canvas_right.dart';
import 'package:app/components/menu_between_canvas.dart';
import 'package:app/components/menu_under_canvas.dart';
import 'package:app/components/pencil_box.dart';
import 'package:app/components/submission_box_new_drawing.dart';
import 'package:flutter/material.dart';

class CreateGamePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Create Game'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Column(
                children: [
                  DrawingCanvasLeft(),
                  MenuUnderCanvas(),
                ],
              ),
              SizedBox(width: 20),
              MenuBetweenCanvas(),
              SizedBox(width: 20),
              Column(
                children: [
                  DrawingCanvasRight(),
                  MenuUnderCanvas(),
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
                  padding: const EdgeInsets.only(left: 190),
                  child: PencilBox(),
                ),
              ),
              SubmissionBoxNewDrawing(),
              SizedBox(width: 50),
            ],
          ),
        ],
      ),
    );
  }
}
