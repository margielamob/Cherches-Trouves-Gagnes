import 'package:flutter/material.dart';

class ChatMessage extends StatefulWidget {
  final String username;
  final bool isFromUser;
  final String text;
  final String date;
  const ChatMessage({
    super.key,
    required this.username,
    required this.isFromUser,
    required this.text,
    required this.date,
  });

  static Map createJson(String username, String message) {
    return {
      'user': {'username': username},
      'message': message,
    };
  }

  Map toJson() {
    return {
      'user': {'username': username},
      'message': text
    };
  }

  @override
  State<ChatMessage> createState() =>
      // ignore: no_logic_in_create_state
      _ChatMessageState(
          username: username, isFromUser: isFromUser, text: text, date: date);
}

class _ChatMessageState extends State<ChatMessage> {
  String username = '';
  String text;
  double textSize = 12;
  FontWeight weight = FontWeight.bold;
  bool isFromUser;
  Color userColor = Colors.blue;
  String date;

  @override
  void initState() {
    super.initState();
    if (mounted) {
      userColor = isFromUser ? Colors.blue : Colors.red;
    }
  }

  _ChatMessageState({
    required this.username,
    required this.isFromUser,
    required this.text,
    required this.date,
  });

  void setDate(String date) {
    this.date = date;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(8.0),
      child: Column(
        children: [
          Text(
            username,
            textAlign: isFromUser ? TextAlign.right : TextAlign.left,
            style: TextStyle(
              color: userColor,
              fontSize: textSize,
              fontWeight: weight,
            ),
          ),
          SizedBox(
            height: 5,
          ),
          Container(
            decoration: BoxDecoration(
              color: isFromUser ? Colors.blue : Colors.grey,
              borderRadius: BorderRadius.circular(12.0),
            ),
            constraints: BoxConstraints(
              maxWidth: MediaQuery.of(context).size.width -
                  20, // Adjust the maximum width as needed
            ),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                text,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: textSize,
                  fontWeight: weight,
                ),
              ),
            ),
          ),
          Text(
            'message sent at $date',
            textAlign: isFromUser ? TextAlign.right : TextAlign.left,
            style: TextStyle(
              fontStyle: FontStyle.italic,
              fontSize: 10,
              fontWeight: FontWeight.normal,
            ),
          )
        ],
      ),
    );
  }
}
