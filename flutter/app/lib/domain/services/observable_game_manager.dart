import 'package:app/domain/models/requests/joinable_games_request.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ObservableGameManager extends ChangeNotifier {
  final SocketService _socket = Get.find();
  JoinableGamesRequest? observableGames;

  ObservableGameManager() {
    handleSockets();
  }

  void getReachableGames(bool isClassicGame) {
    isClassicGame
        ? _socket.send(SocketEvent.getJoinableGames)
        : _socket.send(SocketEvent.getLimitedTimeGames);
  }

  void handleSockets() {
    _socket.on(SocketEvent.classicGameCreated, (dynamic message) {
      JoinableGamesModel request = JoinableGamesModel.fromJson(message);
      if (observableGames == null) {
        final List<JoinableGamesModel> games = [];
        games.add(request);
        observableGames = JoinableGamesRequest(games: games);
      } else {
        observableGames!.games.add(request);
      }
      notifyListeners();
    });

    _socket.on(SocketEvent.limitedGameCreated, (dynamic message) {
      JoinableGamesModel request = JoinableGamesModel.fromJson(message);
      if (observableGames == null) {
        final List<JoinableGamesModel> games = [];
        games.add(request);
        observableGames = JoinableGamesRequest(games: games);
      } else {
        observableGames!.games.add(request);
      }
      notifyListeners();
    });

    _socket.on(SocketEvent.sendingJoinableClassicGames, (dynamic message) {
      JoinableGamesRequest request = JoinableGamesRequest.fromJson(message);
      request.games = request.filterGamesByObservable(true);
      print(request.games);
      observableGames = request;
      notifyListeners();
    });

    _socket.on(SocketEvent.sendingJoinableLimitedGames, (dynamic message) {
      JoinableGamesRequest request = JoinableGamesRequest.fromJson(message);
      observableGames = request;
      notifyListeners();
    });

    _socket.on(SocketEvent.updatePlayers, (dynamic message) {});
  }
}
