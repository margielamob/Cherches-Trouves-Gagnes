import 'package:app/components/logout_dialog.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/end_game_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/game_replay_service.dart';
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

  static AppBar buildWaitingRoomBar(context, String pageName) {
    return AppBar(
      title: Text(pageName),
      actions: [],
    );
  }

  static AppBar buildGameNavigationBar(context, String pageName) {
    DifferenceDetectionService differenceDetectionService = Get.find();
    GameReplayService gameReplayService = Get.find();
    final EndGameService endGameService = Get.find();
    final GameManagerService gameManagerService = Get.find();

    return AppBar(
      title: Text(pageName),
      actions: [
        IconButton(
          icon: Icon(Icons.home),
          onPressed: () {
            gameManagerService.leaveGame();
            differenceDetectionService.resetForNextGame();
            gameReplayService.resetForNextGame();
            endGameService.resetForNextGame();
            Get.offAll(MainPage(), transition: Transition.leftToRight);
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
