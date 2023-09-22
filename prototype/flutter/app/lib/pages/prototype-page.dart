import 'package:app/components/chat-box.dart';
import 'package:app/components/login-dialog.dart';
import 'package:app/constants/theme.dart';
import 'package:app/main.dart';
import 'package:flutter/material.dart';

class PrototypePage extends StatelessWidget {
  static void navigateToPrototypePage(BuildContext context) {
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
      Navigator.pushNamed(context, '/prototype');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Prototype de Messagerie'),
        backgroundColor: MAIN_COLOR,
        actions: [
          ElevatedButton(
              onPressed: () {
                authenticationService.alertLogout();
                Navigator.pushNamed(context, '/');
              },
              child: Icon(Icons.logout)),
        ],
      ),
      body: Center(
        child: ChatBox(
          chatSocketService: chatSocketService,
          authenticationService: authenticationService,
        ),
      ),
    );
  }
}
