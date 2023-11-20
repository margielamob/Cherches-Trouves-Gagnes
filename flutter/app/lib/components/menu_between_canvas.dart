import 'package:flutter/material.dart';

class MenuBetweenCanvas extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: FilledButton(
        onPressed: () {},
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Image.asset(
              'assets/swap-pictures-white.png',
              width: 25.0,
              height: 25.0,
            ),
            SizedBox(width: 8.0),
          ],
        ),
      ),
    );
  }
}
