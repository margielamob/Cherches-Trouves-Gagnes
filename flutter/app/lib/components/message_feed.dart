import 'package:app/components/message.dart';
import 'package:flutter/material.dart';

class MessageFeed extends StatelessWidget {
  final List<Message> messages = [];

  MessageFeed();

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: messages.length,
      itemBuilder: (context, index) {
        return messages[index];
      },
    );
  }
}
