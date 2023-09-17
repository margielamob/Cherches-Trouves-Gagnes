import 'package:app/services/Authentication.service.dart';
import 'package:flutter/material.dart';

class LoginDialog extends StatefulWidget {
  final AuthenticationService authenticationService;

  const LoginDialog({super.key, required this.authenticationService});
  @override
  _LoginDialogState createState() =>
      // ignore: no_logic_in_create_state
      _LoginDialogState(authenticationService);
}

class _LoginDialogState extends State<LoginDialog> {
  final AuthenticationService authenticationService;

  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    authenticationService.socketClient.connect();
    authenticationService.alertConnection();
  }

  _LoginDialogState(this.authenticationService);
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Login'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          TextFormField(
            controller: usernameController,
            decoration: InputDecoration(
              labelText: 'Username',
            ),
          ),
          TextFormField(
            controller: passwordController,
            obscureText: true, // Hide the password
            decoration: InputDecoration(
              labelText: 'Password',
            ),
          ),
        ],
      ),
      actions: <Widget>[
        ElevatedButton(
          onPressed: () {
            authenticationService.logIn(
                usernameController.text, passwordController.text);
            authenticationService.alertConnection();
            Navigator.of(context).pop();
            Navigator.pushNamed(context, '/prototype');
          },
          child: Text('Login'),
        ),
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: Text('Cancel'),
        ),
      ],
    );
  }
}
