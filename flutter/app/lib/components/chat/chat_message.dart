import 'package:flutter/material.dart';

class ChatMessageWidget extends StatelessWidget {
  final String username;
  final bool isFromUser;
  final String text;

  static Map createJson(String username, String message) {
    return {
      "user": {"username": username},
      "message": message,
    };
  }

  const ChatMessageWidget({
    required this.username,
    required this.isFromUser,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    final bgColor = isFromUser ? Colors.blue : Colors.grey[300];
    final textColor = isFromUser ? Colors.white : Colors.black;
    final align =
        isFromUser ? CrossAxisAlignment.end : CrossAxisAlignment.start;

    return Container(
      margin: EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: align,
        children: [
          Text(
            username,
            style: TextStyle(
              color: Colors.blue,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(16.0),
            ),
            padding: const EdgeInsets.all(12.0),
            child: Text(
              text,
              style: TextStyle(
                color: textColor,
                fontSize: 16,
                fontWeight: FontWeight.normal,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
