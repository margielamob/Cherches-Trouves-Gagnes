import 'package:flutter/material.dart';

class PencilBox extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Card(
        shadowColor: Color.fromARGB(255, 46, 46, 46),
        child: Padding(
          padding: EdgeInsets.all(8.0),
          child: SizedBox(
            height: 40,
            width: 250,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FilledButton(
                  onPressed: () {},
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Icon(Icons.create),
                    ],
                  ),
                ),
                SizedBox(width: 30),
                FilledButton(
                  onPressed: () {},
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}
