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
            // Process the username and password
            authenticationService.logIn(
                usernameController.text, passwordController.text);
            // Close the dialog
            Navigator.of(context).pop();

            Navigator.pushNamed(context, '/prototype');
          },
          child: Text('Login'),
        ),
        TextButton(
          onPressed: () {
            // Close the dialog without doing anything
            Navigator.of(context).pop();
          },
          child: Text('Cancel'),
        ),
      ],
    );
  }
}
