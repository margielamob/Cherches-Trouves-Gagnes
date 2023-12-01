import 'package:app/domain/services/chat_service.dart';
import 'package:app/domain/services/difference_detection_service.dart';
import 'package:app/domain/services/end_game_service.dart';
import 'package:app/domain/services/game_manager_service.dart';
import 'package:app/domain/services/game_replay_service.dart';
import 'package:app/domain/services/personal_user_service.dart';
import 'package:app/pages/main_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class EndGameDialog extends StatelessWidget {
  final EndGameService endGameService = Get.find();
  final GameManagerService gameManagerService = Get.find();
  final PersonalUserService _userService = Get.find();
  final ChatManagerService _chatService = Get.find();

  @override
  Widget build(BuildContext context) {
    DifferenceDetectionService differenceDetectionService = Get.find();
    GameReplayService gameReplayService = Get.find();
    endGameService.isGameFinished = false;
    return AlertDialog(
      title: Text("Partie terminée"),
      actions: <Widget>[
        Padding(
          padding: const EdgeInsets.all(10.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text("${endGameService.endGameMessage}"),
              SizedBox(height: 10),
              Row(
                children: [
                  FilledButton(
                    onPressed: () {
                      if (endGameService.endGameMessage ==
                          "La partie est terminée vous avez gagné !") {
                        _userService.addGamesHistoric(
                            gameManagerService.currentUser!.id, true);
                        _userService.updateUserGameWins(
                            gameManagerService.currentUser!.id);
                      } else {
                        _userService.addGamesHistoric(
                            gameManagerService.currentUser!.id, false);
                      }
                      differenceDetectionService.resetForNextGame();
                      Get.offAll(MainPage());
                      _chatService.leaveGameChat();
                    },
                    style: ButtonStyle(
                      minimumSize: MaterialStateProperty.all(Size(100.0, 40.0)),
                    ),
                    child: Text("Quitter la page"),
                  ),
                  SizedBox(width: 20),
                  gameManagerService.gameMode!.value == "Temps Limité"
                      ? SizedBox()
                      : FilledButton(
                          onPressed: () {
                            if (endGameService.endGameMessage ==
                                "La partie est terminée vous avez gagné !") {
                              _userService.addGamesHistoric(
                                  gameManagerService.currentUser!.id, true);
                              _userService.updateUserGameWins(
                                  gameManagerService.currentUser!.id);
                            } else {
                              _userService.addGamesHistoric(
                                  gameManagerService.currentUser!.id, false);
                            }
                            Navigator.of(context).pop();
                            gameReplayService.activateReplayMode();
                          },
                          style: ButtonStyle(
                            minimumSize:
                                MaterialStateProperty.all(Size(100.0, 40.0)),
                          ),
                          child: Text("Revoir la partie"),
                        ),
                ],
              )
            ],
          ),
        ),
      ],
    );
  }
}
