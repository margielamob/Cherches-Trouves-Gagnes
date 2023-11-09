import 'package:app/domain/models/requests/joinable_games_request.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ReachableGameManager extends ChangeNotifier {
  final SocketService _socket = Get.find();
  JoinableGamesRequest? joinableGames;

  ReachableGameManager() {
    handleSockets();
  }

  void getReachableGames() {
    _socket.send(SocketEvent.getJoinableGames);
  }

  void handleSockets() {
    _socket.on(SocketEvent.classicGameCreated, (dynamic message) {
      print("classicGameCreated was called");
      JoinableGamesModel request = JoinableGamesModel.fromJson(message);
      if (joinableGames == null) {
        final List<JoinableGamesModel> games = [];
        games.add(request);
        joinableGames = JoinableGamesRequest(games: games);
      } else {
        joinableGames!.games.add(request);
      }
      notifyListeners();
    });

    _socket.on(SocketEvent.sendingJoinableClassicGames, (dynamic message) {
      print("sendingJoinableClassicGames was called");
      JoinableGamesRequest request = JoinableGamesRequest.fromJson(message);
      joinableGames = request;
      notifyListeners();
    });

    _socket.on(SocketEvent.updatePlayers, (dynamic message) {
      print("updatePlayers was called");
    });
  }
}
