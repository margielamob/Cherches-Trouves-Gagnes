import 'package:app/pages/main-page.dart';
import 'package:app/pages/prototype-page.dart';
import 'package:app/services/authentication.service.dart';
import 'package:app/services/chat-socket.service.dart';
import 'package:app/services/socket-client.service.dart';
import 'package:app/themes/app-main-theme.dart';
import 'package:flutter/material.dart';

// services for dependency injection
var socketClient = SocketClient();
var authenticationService = AuthenticationService(socketClient: socketClient);
var chatSocketService = ChatSocketService(socketClient);
//...
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: appMainTheme,
      initialRoute: '/',
      debugShowCheckedModeBanner: false,
      routes: {
        '/': (context) => MainPage(),
        '/ChatMessagePage': (context) => ChatMessagePage(),
      },
    );
  }
}
