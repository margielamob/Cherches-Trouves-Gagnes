import 'package:flutter/material.dart';

class SubmissionBoxNewDrawing extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      width: 140,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          FilledButton(
            onPressed: () {},
            child: Row(
              children: <Widget>[
                Text("Soumettre"),
                SizedBox(width: 10),
                Icon(Icons.send),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
