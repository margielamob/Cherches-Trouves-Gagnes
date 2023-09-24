import 'package:app/services/authentication.service.dart';
import 'package:flutter/material.dart';

class LogoutDialog extends StatelessWidget {
  final AuthenticationService authenticationService;
  LogoutDialog({required this.authenticationService});
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Logout Confirmation'),
      content: Text('Are you sure you want to log out?'),
      actions: <Widget>[
        TextButton(
          child: Text('Cancel'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        ElevatedButton(
          child: Text('Logout'),
          onPressed: () {
            // Implement your logout logic here
            authenticationService.alertLogout();
            Navigator.pushNamed(context, '/');
          },
        ),
      ],
    );
  }
}
