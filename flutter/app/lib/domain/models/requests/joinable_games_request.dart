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
  final int nbDifferences;
  final Uint8List thumbnail;
  final String roomId;
  final GameCardMultiModel gameInformation;

  JoinableGamesModel(
      {required this.players,
      required this.nbDifferences,
      required this.thumbnail,
      required this.roomId,
      required this.gameInformation});

  factory JoinableGamesModel.fromJson(Map<String, dynamic> json) {
    final playersList = json['players'] as List<dynamic>;
    final gameInformation = json['gameInformation'];

    return JoinableGamesModel(
      players:
          playersList.map((player) => PlayerModel.fromJson(player)).toList(),
      nbDifferences: json['nbDifferences'],
      thumbnail: base64Decode(json['thumbnail'].split(',').last),
      roomId: json['roomId'],
      gameInformation: GameCardMultiModel.fromJson(gameInformation),
    );
  }
}

class JoinableGamesRequest {
  final List<JoinableGamesModel> games;

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
}
