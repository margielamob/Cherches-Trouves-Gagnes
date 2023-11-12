import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

class EndGameService extends ChangeNotifier {
  final SocketService _socket = Get.find();
  String? END_GAME_MESSAGE;
  bool isGameFinished = false;

  EndGameService() {
    handleSockets();
  }

  void handleSockets() {
    _socket.on(SocketEvent.win, (dynamic message) {
      print("SocketEvent.win : $message");
      END_GAME_MESSAGE = "La partie est terminée vous avez gagné !";
      gameFinished(END_GAME_MESSAGE!);
    });
    _socket.on(SocketEvent.lose, (dynamic message) {
      print("SocketEvent.lose : $message");
      END_GAME_MESSAGE = "La partie est terminée vous avez perdu !";
      gameFinished(END_GAME_MESSAGE!);
    });
  }

  void gameFinished(String gameMessage) {
    isGameFinished = true;
    notifyListeners();
  }
}
