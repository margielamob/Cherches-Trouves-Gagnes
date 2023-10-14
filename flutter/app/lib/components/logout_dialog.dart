import 'package:app/services/auth_service.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';

class LogoutDialog extends StatelessWidget {
  final AuthService authService = GetIt.I.get<AuthService>();

  Widget _onSignOutError(context) {
    return AlertDialog(
      title: Text('Oops could not sign out'),
      content: Text('press "OK" to return to main page'),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pushNamed(context, '/MainPage');
          },
          child: Text('OK'),
        )
      ],
    );
  }

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
          onPressed: () async {
            authService
                .signOut()
                .then((_) => Navigator.pushNamed(context, '/'))
                .catchError((error) {
              Navigator.pop(context);
              return _onSignOutError(context);
            });
          },
        ),
      ],
    );
  }
}
