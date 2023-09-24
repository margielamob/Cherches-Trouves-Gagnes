import 'package:app/components/chat-box.dart';
import 'package:app/components/login-dialog.dart';
import 'package:app/components/logout-dialog.dart';
import 'package:app/main.dart';
import 'package:flutter/material.dart';

class ChatMessagePage extends StatelessWidget {
  static void navigateChatMessagePage(BuildContext context) {
    if (!authenticationService.isAccessGranted()) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return LoginDialog(
            authenticationService: authenticationService,
          );
        },
      );
    } else {
      Navigator.pushNamed(context, '/ChatMessagePage');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              child: Text(
                'Channels',
                style: TextStyle(
                  color: Colors.black,
                  fontSize: 24,
                ),
              ),
            ),
            ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.deepPurple,
                child: Icon(
                  Icons.chat,
                  color: Colors.white,
                ),
              ),
              title: Text('Main Channel'),
              onTap: () {
                // Switch to Channel 1
              },
            ),
            // Add more channel options as needed
          ],
        ),
      ),
      body: ChatBox(
          chatSocketService: chatSocketService,
          authenticationService: authenticationService),
      appBar: AppBar(
        title: Text('Chat App'),
        actions: [
          IconButton(
            icon: Icon(Icons.exit_to_app),
            onPressed: () {
              showDialog(
                  context: context,
                  builder: (BuildContext context) {
                    return LogoutDialog(
                        authenticationService: authenticationService);
                  });
            },
          ),
          IconButton(
            icon: Icon(Icons.home),
            onPressed: () {
              // Navigate back to the main page
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}
