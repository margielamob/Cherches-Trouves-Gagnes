import 'package:app/components/chat/chat_panel.dart';
import 'package:flutter/material.dart';

class ChatPage extends StatelessWidget {
  static void navigateChatPage(BuildContext context) {}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ChatPanel(),
    );
  }
}
