import 'package:app/components/logout_dialog.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/pages/main_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CustomAppBar {
  static AppBar buildDefaultBar(context, String pageName) {
    final GameManagerService gameManagerService = Get.find();
    bool isGamePage = Get.currentRoute == '/Classic';
    return AppBar(
      title: Text(pageName),
      actions: [
        IconButton(
          icon: Icon(Icons.home),
          onPressed: () {
            if (isGamePage) {
              gameManagerService.leavingArena();
            }
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

  static AppBar buildGameNavigationBar(context, String pageName) {
    DifferenceDetectionService differenceDetectionService = Get.find();

    return AppBar(
      title: Text(pageName),
      actions: [
        IconButton(
          icon: Icon(Icons.home),
          onPressed: () {
            differenceDetectionService.resetForNextGame();
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
