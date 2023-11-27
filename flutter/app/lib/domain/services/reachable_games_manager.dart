import 'package:app/domain/models/requests/joinable_games_request.dart';
import 'package:app/domain/services/socket_service.dart';
import 'package:app/domain/utils/socket_events.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ReachableGameManager extends ChangeNotifier {
  final SocketService _socket = Get.find();
  JoinableGamesRequest? joinableGames;
  // JoinableGamesRequest? joinableLimitedGames;

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
      JoinableGamesModel request = JoinableGamesModel.fromJson(message);
      if (joinableGames == null) {
        final List<JoinableGamesModel> games = [];
        games.add(request);
        joinableGames = JoinableGamesRequest(games: games);
      } else {
        joinableGames!.games.add(request);
      }
      // } else {
      //   var index = joinableClassicGames!.findExistingGameIndex(request.roomId);
      //   if (index == -1) {
      //     joinableClassicGames!.games.add(request);
      //   } else {
      //     joinableClassicGames!.replaceGame(request, index);
      //   }
      // }
      notifyListeners();
    });

    _socket.on(SocketEvent.limitedGameCreated, (dynamic message) {
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
      JoinableGamesRequest request = JoinableGamesRequest.fromJson(message);
      joinableGames = request;
      notifyListeners();
    });

    _socket.on(SocketEvent.sendingJoinableLimitedGames, (dynamic message) {
      JoinableGamesRequest request = JoinableGamesRequest.fromJson(message);
      joinableGames = request;
      notifyListeners();
    });

    _socket.on(SocketEvent.updatePlayers, (dynamic message) {});
  }
}
