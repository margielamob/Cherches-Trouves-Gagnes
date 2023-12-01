import 'package:app/domain/models/requests/joinable_games_request.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ReachableGameManager extends ChangeNotifier {
  final SocketService _socket = Get.find();
  bool? isClassicGame;
  JoinableGamesRequest? joinableGames;

  ReachableGameManager() {
    handleSockets();
  }

  void getReachableGames(bool isClassicGame) {
    isClassicGame
        ? _socket.send(SocketEvent.getJoinableGames)
        : _socket.send(SocketEvent.getLimitedTimeGames);
  }

  void handleSockets() {
    _socket.on(SocketEvent.classicGameCreated, (dynamic message) {
      if (isClassicGame == null) {
        return;
      }
      if (isClassicGame!) {
        JoinableGamesModel request = JoinableGamesModel.fromJson(message);
        if (joinableGames == null) {
          final List<JoinableGamesModel> games = [];
          games.add(request);
          joinableGames = JoinableGamesRequest(games: games);
        } else {
          joinableGames!.games.add(request);
        }
        notifyListeners();
      }
    });

    _socket.on(SocketEvent.limitedGameCreated, (dynamic message) {
      if (isClassicGame == null) {
        return;
      }
      if (!isClassicGame!) {
        JoinableGamesModel request = JoinableGamesModel.fromJson(message);
        if (joinableGames == null) {
          final List<JoinableGamesModel> games = [];
          games.add(request);
          joinableGames = JoinableGamesRequest(games: games);
        } else {
          joinableGames!.games.add(request);
        }
        notifyListeners();
      }
    });

    _socket.on(SocketEvent.sendingJoinableClassicGames, (dynamic message) {
      if (isClassicGame == null) {
        return;
      }
      if (isClassicGame!) {
        JoinableGamesRequest request = JoinableGamesRequest.fromJson(message);
        request.games = request.filterGamesByObservable(false);
        joinableGames = request;
        notifyListeners();
      }
    });

    _socket.on(SocketEvent.sendingJoinableLimitedGames, (dynamic message) {
      if (isClassicGame == null) {
        return;
      }
      if (!isClassicGame!) {
        JoinableGamesRequest request = JoinableGamesRequest.fromJson(message);
        request.games = request.filterGamesByObservable(false);
        joinableGames = request;
        notifyListeners();
      }
    });

    _socket.on(SocketEvent.updatePlayers, (dynamic message) {});
  }
}
