import 'package:app/components/message.dart';
import 'package:app/services/socket-client.service.dart';
import 'package:flutter/material.dart';

class MessageFeed extends StatelessWidget {
  final List<Message> messages = [];
  final SocketClient socketClient = SocketClient();

  MessageFeed();

  void init() {
    socketClient.connect();
  }

  void dispose() {
    socketClient.disconnect();
  }

  void handleEvent() {
    socketClient.on('message', (data) {
      messages.add(Message(user: data['user'], text: data['text']));
    });
  }

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
