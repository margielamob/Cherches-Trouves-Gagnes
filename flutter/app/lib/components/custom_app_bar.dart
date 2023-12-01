import 'package:app/components/logout_dialog.dart';
import 'package:app/domain/services/chat_display_service.dart';
import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/end_game_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/game_replay_service.dart';
import 'package:app/pages/main_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CustomAppBar {
  static AppBar buildDefaultBar(
      BuildContext context, String pageName, int unreadMessages) {
    final ChatDisplayService chatDisplayService = Get.find();
    return AppBar(
      title: Text(pageName),
      actions: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: IconButton(
            icon: Icon(Icons.home),
            onPressed: () {
              Get.offAll(MainPage(), transition: Transition.leftToRight);
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Badge(
            isLabelVisible: unreadMessages > 0,
            label: Text(unreadMessages.toString()),
            backgroundColor: Colors.red,
            child: IconButton(
              icon: Icon(Icons.chat_bubble),
              onPressed: () => chatDisplayService.toggleChat(),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: IconButton(
            icon: Icon(Icons.exit_to_app),
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return LogoutDialog();
                },
              );
            },
          ),
        ),
      ],
    );
  }

  static AppBar buildWaitingRoomBar(
      context, String pageName, int unreadMessages) {
    final GameManagerService gameManagerService = Get.find();
    final ChatDisplayService chatDisplayService = Get.find();
    final ChatManagerService chatManagerService = Get.find();

    return AppBar(
      title: Text(pageName),
      actions: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Badge(
            isLabelVisible: unreadMessages > 0,
            label: Text(unreadMessages.toString()),
            backgroundColor: Colors.red,
            child: IconButton(
              icon: Icon(Icons.chat_bubble),
              onPressed: () => chatDisplayService.toggleChat(),
            ),
          ),
        ),
      ],
    );
  }

  static AppBar buildGameNavigationBar(
      context, String pageName, int unreadMessages) {
    final DifferenceDetectionService differenceDetectionService = Get.find();
    final GameReplayService gameReplayService = Get.find();
    final EndGameService endGameService = Get.find();
    final GameManagerService gameManagerService = Get.find();
    final ChatDisplayService chatDisplayService = Get.find();

    return AppBar(
      title: Text(pageName),
      actions: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: IconButton(
            icon: Icon(Icons.home),
            onPressed: () {
              gameManagerService.leaveGame();
              differenceDetectionService.resetForNextGame();
              gameReplayService.resetForNextGame();
              endGameService.resetForNextGame();
              Get.offAll(MainPage(), transition: Transition.leftToRight);
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Badge(
            isLabelVisible: unreadMessages > 0,
            label: Text(unreadMessages.toString()),
            backgroundColor: Colors.red,
            child: IconButton(
              icon: Icon(Icons.chat_bubble),
              onPressed: () => chatDisplayService.toggleChat(),
            ),
          ),
        ),
      ],
    );
  }

  static AppBar buildLogoutOnly(
      BuildContext context, String pageName, int unreadMessages) {
    final ChatDisplayService chatDisplayService = Get.find();
    return AppBar(
      title: Text(pageName),
      actions: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Badge(
            isLabelVisible: unreadMessages > 0,
            label: Text(unreadMessages.toString()),
            backgroundColor: Colors.red,
            child: IconButton(
              icon: Icon(Icons.chat_bubble),
              onPressed: () => chatDisplayService.toggleChat(),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: IconButton(
            icon: Icon(Icons.exit_to_app),
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return LogoutDialog();
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
