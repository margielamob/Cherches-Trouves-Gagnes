import 'dart:convert';
import 'dart:typed_data';

import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/score_model.dart';

class GameCardMultiModel {
  final String id;
  final String name;
  final Uint8List thumbnail;
  final String idOriginalBmp;
  final String idEditedBmp;
  final List<ScoreModel> soloScore;
  final List<ScoreModel> multiplayerScore;
  final int nbDifferences;
  final bool isMulti;

  const GameCardMultiModel({
    required this.id,
    required this.name,
    required this.thumbnail,
    required this.idOriginalBmp,
    required this.idEditedBmp,
    required this.soloScore,
    required this.multiplayerScore,
    required this.nbDifferences,
    required this.isMulti,
  });

  GameCardModel toGameCardModel() {
    return GameCardModel(
        id: id,
        title: name,
        thumbnail: thumbnail,
        nbDifferences: nbDifferences,
        idEditedBmp: idEditedBmp,
        idOriginalBmp: idOriginalBmp);
  }

  factory GameCardMultiModel.fromJson(Map json) {
    return GameCardMultiModel(
      id: json['id'],
      name: json['name'],
      thumbnail: base64Decode(json['thumbnail'].split(',').last),
      idOriginalBmp: json['idOriginalBmp'],
      idEditedBmp: json['idEditedBmp'],
      soloScore: json['soloScore']
          .map<ScoreModel>((score) => ScoreModel.fromJson(score))
          .toList(),
      multiplayerScore: json['multiplayerScore']
          .map<ScoreModel>((score) => ScoreModel.fromJson(score))
          .toList(),
      nbDifferences: json['nbDifferences'],
      isMulti: json['isMulti'],
    );
  }
}
