import 'package:app/domain/services/auth_service.dart';
import 'package:app/pages/login_page.dart';
import 'package:app/pages/main_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class LogoutDialog extends StatelessWidget {
  final AuthService authService = Get.find();

  Widget _showErrorToUser(context) {
    return AlertDialog(
      title: Text('Oops could not sign out'),
      content: Text('press "OK" to return to main page'),
      actions: [
        TextButton(
          onPressed: () {
            Get.offAll(MainPage());
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
            authService.signOut().then((_) {
              Navigator.of(context).pop();
              Get.offAll(LoginPage(), transition: Transition.leftToRight);
            }).catchError((error) {
              Navigator.of(context).pop();
              _showErrorToUser(context);
            });
          },
        ),
      ],
    );
  }
}
