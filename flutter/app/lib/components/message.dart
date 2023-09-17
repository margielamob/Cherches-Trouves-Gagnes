import 'dart:convert';

import 'package:flutter/material.dart';

class Message extends StatelessWidget {
  final String user;
  final String text;
  final double size = 12;
  final FontWeight weight = FontWeight.normal;
  final bool isFromUser;
  late Color userColor;

  Message({
    required this.text,
    required this.user,
    required this.isFromUser,
  }) {
    userColor = isFromUser ? Colors.blue : Colors.purple;
  }

  String toJson() {
    var json = {'userName': user, 'message': text};
    return jsonEncode(json);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(left: 20, top: 10),
      child: Row(
        children: <Widget>[
          Text(
            user,
            style: TextStyle(
              color: userColor,
              fontSize: size,
              fontWeight: weight,
            ),
          ),
          SizedBox(
            width: 10,
          ),
          Flexible(
            child: Text(
              text,
              style: TextStyle(
                color: Colors.black,
                fontSize: size,
                fontWeight: weight,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
