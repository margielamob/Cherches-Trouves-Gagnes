import 'package:flutter/material.dart';

class ClassicGameModal extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Mode de jeux classique"),
      actions: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton(
              onPressed: () {
                Navigator.pushNamed(context, '/gameSelection');
              },
              child: Text("Créer"),
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
            ),
            SizedBox(width: 30),
            FilledButton(
              onPressed: () {},
              child: Text("Joindre"),
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
