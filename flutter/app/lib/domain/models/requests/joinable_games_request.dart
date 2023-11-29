import 'dart:convert';
import 'dart:typed_data';

import 'package:app/domain/models/game_card_multi_model.dart';

class PlayerModel {
  final String id;
  final String name;
  final String? avatar;
  PlayerModel({required this.id, required this.name, this.avatar});

  factory PlayerModel.fromJson(Map<String, dynamic> json) {
    return PlayerModel(
      name: json['name'],
      id: json['id'],
      avatar: json['avatar'] ?? "assets/default-user-icon.png",
    );
  }
}

class JoinableGamesModel {
  final List<PlayerModel> players;
  final List<PlayerModel> observers;
  final int nbDifferences;
  final Uint8List thumbnail;
  final String roomId;
  final GameCardMultiModel gameInformation;
  bool? isObservable;

  JoinableGamesModel(
      {required this.players,
      required this.observers,
      required this.nbDifferences,
      required this.thumbnail,
      required this.roomId,
      required this.gameInformation,
      this.isObservable});

  factory JoinableGamesModel.fromJson(Map<String, dynamic> json) {
    final playersList = json['players'] as List<dynamic>;
    final observersList = json['observers'] as List<dynamic>;
    final gameInformation = json['gameInformation'];

    if (json['isObservable'] == null) {
      return JoinableGamesModel(
        players:
            playersList.map((player) => PlayerModel.fromJson(player)).toList(),
        observers: observersList
            .map((player) => PlayerModel.fromJson(player))
            .toList(),
        nbDifferences: json['nbDifferences'],
        thumbnail: base64Decode(json['thumbnail'].split(',').last),
        roomId: json['roomId'],
        gameInformation: GameCardMultiModel.fromJson(gameInformation),
      );
    } else {
      return JoinableGamesModel(
        players:
            playersList.map((player) => PlayerModel.fromJson(player)).toList(),
        observers: observersList
            .map((player) => PlayerModel.fromJson(player))
            .toList(),
        nbDifferences: json['nbDifferences'],
        thumbnail: base64Decode(json['thumbnail'].split(',').last),
        roomId: json['roomId'],
        gameInformation: GameCardMultiModel.fromJson(gameInformation),
        isObservable: json['isObservable'],
      );
    }
  }
}

class JoinableGamesRequest {
  List<JoinableGamesModel> games;
  JoinableGamesRequest({required this.games});

  factory JoinableGamesRequest.fromJson(Map<String, dynamic> json) {
    final gameList = json['games'] as List<dynamic>;
    return JoinableGamesRequest(
      games: gameList
          .map((gameJson) => JoinableGamesModel.fromJson(gameJson))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'games': games,
    };
  }

  List<JoinableGamesModel> filterGamesByObservable(bool isObservableFilter) {
    return games
        .where((game) =>
            game.isObservable == isObservableFilter ||
            (game.isObservable == null && !isObservableFilter))
        .toList();
  }

  List<JoinableGamesModel> removeDoubloons() {
    final List<JoinableGamesModel> gamesWithoutDoubloons = [];
    final List<String> ids = [];
    for (final game in games) {
      if (!ids.contains(game.roomId)) {
        gamesWithoutDoubloons.add(game);
        ids.add(game.roomId);
      }
    }
    return gamesWithoutDoubloons;
  }
}
