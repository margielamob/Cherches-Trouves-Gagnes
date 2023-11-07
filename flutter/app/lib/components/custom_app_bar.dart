import 'package:app/components/logout_dialog.dart';
import 'package:app/pages/main_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CustomAppBar {
  static AppBar buildDefaultBar(context, String pageName) {
    return AppBar(
      title: Text(pageName),
      actions: [
        IconButton(
          icon: Icon(Icons.home),
          onPressed: () {
            Get.offAll(MainPage(), transition: Transition.leftToRight);
          },
        ),
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
      ],
    );
  }

  static AppBar buildLogoutOnly(context, String pageName) {
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
      ],
    );
  }
}
