import 'package:flutter/material.dart';

class ErrorModal extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Error'),
      content: Column(children: [
        Text("Sorry something wrong happened :("),
      ]),
      actions: <Widget>[
        FilledButton(
          onPressed: () => Navigator.pop(context, "OK"),
          child: const Text('Close'),
        ),
      ],
    );
  }
}
