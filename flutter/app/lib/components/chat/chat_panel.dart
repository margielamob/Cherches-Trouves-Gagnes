import 'package:app/components/chat/chat_feed.dart';
import 'package:app/components/chat/chat_left_panel.dart';
import 'package:flutter/material.dart';

class ChatPanel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(16),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.5),
            spreadRadius: 2,
            blurRadius: 4,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Expanded(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Expanded(
              flex: 1,
              child: Container(
                  width: MediaQuery.of(context).size.width * 0.25,
                  child: ChatLeftPanel()),
            ),
            SizedBox(width: 16),
            Expanded(
              flex: 3,
              child: Container(
                  width: MediaQuery.of(context).size.width * 0.75,
                  child: ChatFeed()),
            ),
          ],
        ),
      ),
    );
  }
}
