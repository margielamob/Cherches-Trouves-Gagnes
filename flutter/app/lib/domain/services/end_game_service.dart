import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

class EndGameService extends ChangeNotifier {
  final SocketService _socket = Get.find();
  String? endGameMessage;
  bool isGameFinished = false;

  EndGameService() {
    handleSockets();
  }

  void handleSockets() {
    _socket.on(SocketEvent.win, (dynamic message) {
      print("SocketEvent.win : $message");
      endGameMessage = "La partie est terminée vous avez gagné !";
      gameFinished(endGameMessage!);
      // _userService.updateUserTotalTimePlayed(
      //     _gameManagerService.currentUser!.id,
      //     _gameManagerService.startingTimer! - _timerService.time!);
    });
    _socket.on(SocketEvent.lose, (dynamic message) {
      print("SocketEvent.lose : $message");
      endGameMessage = "La partie est terminée vous avez perdu !";
      gameFinished(endGameMessage!);
      // _userService.updateUserTotalTimePlayed(
      //     _gameManagerService.currentUser!.id,
      //     _gameManagerService.startingTimer! - _timerService.time!);
    });
  }

  void gameFinished(String gameMessage) {
    isGameFinished = true;
    notifyListeners();
  }
}
