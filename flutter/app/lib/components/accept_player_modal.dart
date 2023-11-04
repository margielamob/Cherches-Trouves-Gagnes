import 'package:flutter/material.dart';

class AcceptPlayerModal extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Voulez-vous accepter ce joueur?"),
      actions: <Widget>[
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FilledButton(
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text("Annuler"),
            ),
            SizedBox(width: 30),
            FilledButton(
              style: ButtonStyle(
                minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text("Accepter"),
            ),
          ],
        ),
      ],
    );
  }
}
