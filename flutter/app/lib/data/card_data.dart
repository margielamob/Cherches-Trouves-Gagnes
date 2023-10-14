import 'package:app/data/score_data.dart';

class CardData {
  final String id;
  final String name;
  final String thumbnail;
  final String idOriginalBmp;
  final String idEditedBmp;
  final int nbDifferences;
  final List<ScoreData> soloScore;
  final List<ScoreData> multiplayerScore;

  const CardData({
    required this.id,
    required this.idEditedBmp,
    required this.idOriginalBmp,
    required this.name,
    required this.nbDifferences,
    required this.thumbnail,
    required this.soloScore,
    required this.multiplayerScore,
  });

  factory CardData.fromJson(Map json) {
    return CardData(
      id: json['id'],
      idEditedBmp: json['idEditedBmp'],
      idOriginalBmp: json['idOriginalBmp'],
      name: json['name'],
      nbDifferences: json['nbDifferences'],
      thumbnail: json['thumbnail'],
      soloScore: (json['multiplayerScore'] as List)
          .map((e) => ScoreData.fromJson(e))
          .toList(),
      multiplayerScore: (json['multiplayerScore'] as List)
          .map((e) => ScoreData.fromJson(e))
          .toList(),
    );
  }

  static List<CardData> fromJsonList(List json) {
    return json.map((e) => CardData.fromJson(e)).toList();
  }
}
