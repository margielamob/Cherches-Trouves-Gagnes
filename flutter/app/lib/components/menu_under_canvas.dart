import 'package:flutter/material.dart';

class MenuUnderCanvas extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        FilledButton(
          onPressed: () {},
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Icon(Icons.layers_clear),
            ],
          ),
        ),
        SizedBox(width: 50),
        FilledButton(
          onPressed: () {},
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Icon(Icons.image),
            ],
          ),
        ),
        SizedBox(width: 50),
        FilledButton(
          onPressed: () {},
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Image.asset(
                'assets/image_not_working.png',
                width: 22.0,
                height: 22.0,
              ),
              SizedBox(width: 8.0),
            ],
          ),
        ),
      ],
    );
  }
}
