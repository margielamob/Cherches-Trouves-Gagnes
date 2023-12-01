import 'dart:async';

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
  String activeRoom = '';

  FocusNode _textFocusNode = FocusNode();
  TextEditingController _textController = TextEditingController();
  late ScrollController _scrollController;

  _ChatFeedState() {}

  StreamSubscription<List<ChatMessage>>? messageSubscription;
  StreamSubscription<String>? activeRoomSubscription;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    messageSubscription = chatManager.messages.stream.listen((message) {
      setState(() {
        messages = message;
      });
    });
    activeRoomSubscription = chatManager.activeRoom.stream.listen((value) {
      setState(() {
        activeRoom = value;
      });
    });
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

  // @override
  // void dispose() {
  //   super.dispose();
  //   _scrollController.dispose();
  // }

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
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
      ),
      clipBehavior: Clip.antiAlias,
      child: Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          leading: null,
          title: Text(activeRoom),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(10),
            ),
          ),
        ),
        body: Column(
          children: [
            Expanded(
              child: ListView.builder(
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
      ),
    );
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    messageSubscription?.cancel();
    activeRoomSubscription?.cancel();
  }
}
