import 'package:app/components/chat-message.dart';
import 'package:app/components/user.dart';
import 'package:app/services/authentication.service.dart';
import 'package:app/services/chat-socket.service.dart';
import 'package:flutter/material.dart';

class ChatBox extends StatefulWidget {
  final ChatSocketService chatSocketService;
  final AuthenticationService authenticationService;

  const ChatBox(
      {super.key,
      required this.chatSocketService,
      required this.authenticationService});
  @override
  State<ChatBox> createState() =>
      // ignore: no_logic_in_create_state
      _ChatBoxState(chatSocketService, authenticationService);
}

class _ChatBoxState extends State<ChatBox> {
  final ChatSocketService chatSocketService;
  late User user = User();
  final AuthenticationService authenticationService;
  List<ChatMessage> messages = [];
  final bool canType = true;
  bool showScrollDownArrow = false;
  FocusNode _textFocusNode = FocusNode();
  TextEditingController _textController = TextEditingController();
  ScrollController _scrollController = ScrollController();

  _ChatBoxState(this.chatSocketService, this.authenticationService) {
    user = authenticationService.user;
  }

  @override
  void initState() {
    super.initState();
    chatSocketService.handleReception(user, updateMessages);
    chatSocketService.handleMessagesServed(user, loadMessages);
    chatSocketService.fetchMessages();

    _scrollController.addListener(() {
      // I know this is dumb to do it this way
      // but when I simply assign the boolean expression
      // to the variable it doesnt work as expected
      // reaaallyyy strange...
      setState(() {
        if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent) {
          showScrollDownArrow = false;
        } else {
          showScrollDownArrow = true;
        }
      });
    });
  }

  void loadMessages(List<ChatMessage> newMessages) {
    if (mounted) {
      setState(() {
        messages = newMessages;
        showScrollDownArrow = newMessages.isNotEmpty;
      });
    }
  }

  void updateMessages(ChatMessage message) {
    if (mounted) {
      setState(() {
        messages.add(message);
        Future.delayed(Duration(milliseconds: 100), () {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        });
      });
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  void sendMessage(String text) {
    if (text.isEmpty) return;

    chatSocketService.sendMessage(text, user);
    if (mounted) {
      setState(() {
        _textController.clear();
      });
    }
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
                      return messages[index];
                    },
                  ),
                  if (showScrollDownArrow) // Show the scroll down arrow if there are new messages
                    Align(
                      alignment: Alignment.bottomCenter,
                      child: GestureDetector(
                        onTap: () {
                          _scrollController.animateTo(
                            _scrollController.position.maxScrollExtent,
                            duration: Duration(milliseconds: 300),
                            curve: Curves.easeOut,
                          );
                          setState(() {
                            showScrollDownArrow = false;
                          });
                        },
                        child: Container(
                          padding: EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.deepPurple.withOpacity(0.6),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.arrow_downward,
                            color: Colors.white,
                          ),
                        ),
                      ),
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
                    _textFocusNode.requestFocus();
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
                  _textFocusNode.requestFocus();
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
