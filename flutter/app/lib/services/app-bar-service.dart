import 'package:app/components/logout-dialog.dart';
import 'package:flutter/material.dart';

class AppBarService {
  static AppBar buildBar(context, String pageName) {
    return AppBar(
      title: Text(pageName),
      actions: [
        IconButton(
          icon: Icon(Icons.exit_to_app),
          onPressed: () {
            showDialog(
                context: context,
                builder: (BuildContext context) {
                  return LogoutDialog();
                });
          },
        ),
        IconButton(
          icon: Icon(Icons.home),
          onPressed: () {
            Navigator.pushNamed(context, '/');
          },
        ),
      ],
    );
  }
}
