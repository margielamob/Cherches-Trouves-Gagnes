import 'dart:convert';

import 'package:app/components/message.dart';
import 'package:app/components/user.dart';
import 'package:app/services/Authentication.service.dart';
import 'package:app/services/socket-client.service.dart';
import 'package:flutter/material.dart';

class Chat extends StatefulWidget {
  final SocketClient socketClient;
  final AuthenticationService authenticationService;

  const Chat(
      {super.key,
      required this.socketClient,
      required this.authenticationService});
  @override
  // ignore: no_logic_in_create_state
  State<Chat> createState() => _ChatState(socketClient, authenticationService);
}

class _ChatState extends State<Chat> {
  final SocketClient socketClient;
  late User user = User();
  final AuthenticationService authenticationService;
  final List<Message> messages = [];
  final bool canType = true;
  TextEditingController textController = TextEditingController();

  _ChatState(this.socketClient, this.authenticationService) {
    user = authenticationService.user;
  }

  @override
  void initState() {
    super.initState();
    handleMessageReception();
  }

  @override
  void dispose() {
    super.dispose();
    authenticationService.socketClient.disconnect();
  }

  void sendMessage(String text) {
    if (text.isEmpty) return;
    var message = Message(
      text: text,
      user: user.username,
      isFromUser: true,
    );
    socketClient.emit('protoTypeMessage', message.toJson());
    print(message.toJson());
    if (mounted) {
      setState(() {
        textController.clear();
      });
    }
  }

  void handleMessageReception() {
    socketClient.on('newMessage', (payload) {
      payload = jsonDecode(payload);
      bool isFromUser = payload['username'] == user.username;
      var message = Message(
        text: payload['message'],
        user: payload['username'],
        isFromUser: isFromUser,
      );
      if (mounted) {
        setState(() {
          messages.add(message);
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 10, horizontal: 10),
      width: 400,
      height: 400,
      decoration: BoxDecoration(
          color: Color.fromARGB(255, 173, 177, 184).withOpacity(0.4),
          border:
              Border.all(width: 2, color: Color.fromARGB(255, 255, 255, 255)),
          borderRadius: BorderRadius.circular(10)),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            margin: EdgeInsets.only(top: 20),
            width: 300,
            height: 300,
            decoration: BoxDecoration(
                boxShadow: [
                  BoxShadow(
                    color: Color.fromARGB(255, 252, 252, 252), // Shadow color
                    blurRadius: 10.0, // Shadow blur radius
                    spreadRadius: 0, // Shadow spread radius
                    offset: Offset(0, 4.0), // Shadow offset
                  )
                ],
                border: Border.all(
                    width: 1,
                    color: Color.fromARGB(255, 255, 255, 255),
                    style: BorderStyle.solid),
                borderRadius: BorderRadius.all(Radius.circular(10))),
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) {
                return messages[index];
              },
            ),
          ),
          SizedBox(height: 16.0),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(width: 35),
              Container(
                width: 300,
                height: 30,
                margin: EdgeInsets.only(bottom: 10),
                child: TextField(
                  controller: textController,
                  onSubmitted: (message) {
                    sendMessage(message);
                  },
                  decoration: InputDecoration(
                    border: OutlineInputBorder(),
                    labelText: 'Entrez votre message',
                    enabled: canType,
                  ),
                ),
              ),
              Flexible(
                child: Container(
                  margin: EdgeInsets.only(bottom: 10),
                  child: InkWell(
                    onTap: () {
                      sendMessage(textController.text);
                    },
                    customBorder: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    child: Container(
                      padding: EdgeInsets.all(5.0),
                      child: Icon(Icons.send, color: Colors.black),
                    ),
                  ),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}
