import 'package:app/domain/models/score_model.dart';

class GameModel {
  final String id;
  final String name;
  final String thumbnail;
  final String idOriginalBmp;
  final String idEditedBmp;
  final List<ScoreModel> soloScore;
  final List<ScoreModel> multiplayerScore;
  final int nbDifferences;
  final bool isMulti;

  const GameModel({
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

  factory GameModel.fromJson(Map json) {
    return GameModel(
      id: json['id'],
      name: json['name'],
      thumbnail: json['thumbnail'],
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
