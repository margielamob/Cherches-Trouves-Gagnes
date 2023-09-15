import 'package:flutter/material.dart';

class Message extends StatelessWidget {
  final String user;
  final String text;
  final Color color = Colors.black;
  final double size = 12;
  final FontWeight weight = FontWeight.normal;

  Message({
    required this.text,
    required this.user,
  });

  @override
  Widget build(BuildContext context) {
    return Row(children: <Widget>[
      Text(
        user,
        style: TextStyle(
          color: color,
          fontSize: size,
          fontWeight: weight,
        ),
      ),
      SizedBox(
        width: 10,
      ),
      Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: size,
          fontWeight: weight,
        ),
      ),
    ]);
  }
}
