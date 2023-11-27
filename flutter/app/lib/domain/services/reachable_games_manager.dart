import 'package:app/domain/models/requests/joinable_games_request.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ReachableGameManager extends ChangeNotifier {
  final SocketService _socket = Get.find();
  JoinableGamesRequest? joinableClassicGames;
  JoinableGamesRequest? joinableLimitedGames;

  ReachableGameManager() {
    handleSockets();
  }

  void getReachableGames(bool isClassicGame) {
    print(isClassicGame);
    isClassicGame
        ? _socket.send(SocketEvent.getJoinableGames)
        : _socket.send(SocketEvent.getLimitedTimeGames);
  }

  void handleSockets() {
    _socket.on(SocketEvent.classicGameCreated, (dynamic message) {
      JoinableGamesModel request = JoinableGamesModel.fromJson(message);
      if (joinableClassicGames == null) {
        final List<JoinableGamesModel> games = [];
        games.add(request);
        joinableClassicGames = JoinableGamesRequest(games: games);
      } else {
        joinableClassicGames!.games.add(request);
      }
      notifyListeners();
    });

    _socket.on(SocketEvent.limitedGameCreated, (dynamic message) {
      JoinableGamesModel request = JoinableGamesModel.fromJson(message);
      if (joinableLimitedGames == null) {
        final List<JoinableGamesModel> games = [];
        games.add(request);
        joinableLimitedGames = JoinableGamesRequest(games: games);
      } else {
        joinableLimitedGames!.games.add(request);
      }
      notifyListeners();
    });

    _socket.on(SocketEvent.sendingJoinableClassicGames, (dynamic message) {
      JoinableGamesRequest request = JoinableGamesRequest.fromJson(message);
      joinableClassicGames = request;
      notifyListeners();
    });

    _socket.on(SocketEvent.sendingJoinableLimitedGames, (dynamic message) {
      JoinableGamesRequest request = JoinableGamesRequest.fromJson(message);
      joinableClassicGames = request;
      notifyListeners();
    });

    _socket.on(SocketEvent.updatePlayers, (dynamic message) {});
  }
}
