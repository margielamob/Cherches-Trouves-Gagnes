import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

class EndGameService extends ChangeNotifier {
  final SocketService _socket = Get.find();
  bool isGameFinished = false;
  String END_GAME_MESSAGE = "La partie est terminée vous avez ";

  EndGameService() {
    handleSockets();
    isGameFinished = false;
  }

  void handleSockets() {
    _socket.on(SocketEvent.win, (dynamic message) {
      print("SocketEvent.win : $message");
      END_GAME_MESSAGE += "gagné !";
      isGameFinished = true;
      notifyListeners();
    });
    _socket.on(SocketEvent.lose, (dynamic message) {
      print("SocketEvent.lose : $message");
      END_GAME_MESSAGE += "perdu !";
      isGameFinished = true;
      notifyListeners();
    });
  }
}
