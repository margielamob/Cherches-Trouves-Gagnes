import 'package:app/components/chat/chat_message.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../domain/models/chat_model.dart';

class ChatFeed extends StatefulWidget {
  const ChatFeed({super.key});
  @override
  State<ChatFeed> createState() =>
      // ignore: no_logic_in_create_state
      _ChatFeedState();
}

class _ChatFeedState extends State<ChatFeed> {
  final SocketService socket = Get.find();
  final ChatManagerService chatManager = Get.find();

  List<ChatMessage> messages = [];

  FocusNode _textFocusNode = FocusNode();
  TextEditingController _textController = TextEditingController();
  late ScrollController _scrollController;

  _ChatFeedState() {
    chatManager.messages.stream.listen((message) {
      setState(() {
        messages = message;
      });
    });
  }

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    // chatManager.fetchMessages();
  }

  void loadMessages(List<ChatMessage> newMessages) {
    if (mounted) {
      setState(() {
        messages = newMessages;
      });
    }
  }

  void updateMessages(ChatMessage message) {
    if (mounted) {
      setState(() {
        messages.add(message);
      });

      // Schedule the scroll after the layout has updated
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Future.delayed(Duration(milliseconds: 200), _scrollDown);
      });
    }
  }

  void _scrollDown() {
    _scrollController.animateTo(
      _scrollController.position.maxScrollExtent,
      duration: Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  @override
  void dispose() {
    super.dispose();
    _scrollController.dispose();
  }

  void sendMessage(String text) {
    if (text.isEmpty) return;

    chatManager.sendMessage(text);
    if (mounted) {
      setState(() {
        _textController.clear();
      });
    }
    _textFocusNode.requestFocus();
    _scrollDown();
  }

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
      child: Column(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Stack(
                children: [
                  ListView.builder(
                    controller: _scrollController,
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      return messages
                          .map((e) => ChatMessageWidget(
                              username: e.user,
                              isFromUser: chatManager.isOwnMessage(e),
                              text: e.message))
                          .toList()[index];
                    },
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 16.0),
          Row(
            children: [
              Expanded(
                child: TextField(
                  focusNode: _textFocusNode,
                  controller: _textController,
                  onSubmitted: (message) {
                    sendMessage(message);
                  },
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    labelText: 'Enter your message',
                  ),
                ),
              ),
              SizedBox(width: 16),
              GestureDetector(
                onTap: () {
                  sendMessage(_textController.text);
                },
                child: Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.deepPurple,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.send,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
