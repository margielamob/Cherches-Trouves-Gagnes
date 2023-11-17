import 'package:app/domain/utils/vec2.dart';

class DifferenceModel {
  List<Vec2> coordinates;
  int nbDifferencesLeft;
  bool? isPlayerFoundDifference;

  DifferenceModel(
      {required this.coordinates,
      required this.nbDifferencesLeft,
      this.isPlayerFoundDifference});

  factory DifferenceModel.fromJson(Map<String, dynamic> json) {
    List<dynamic> coordsList = json['coords'] ?? [];
    List<Vec2> parsedCoords =
        coordsList.map((coord) => Vec2.fromJson(coord)).toList();

    return DifferenceModel(
      coordinates: parsedCoords,
      nbDifferencesLeft: json['nbDifferencesLeft'],
    );
  }
}

class DifferenceFoundMessage {
  String playerName;
  Vec2 differenceCoord;
  DifferenceModel data;

  DifferenceFoundMessage(
      {required this.data,
      required this.differenceCoord,
      required this.playerName});

  factory DifferenceFoundMessage.fromJson(Map<String, dynamic> json) {
    String playerName = json['playerName'];
    Vec2 differenceCoord = Vec2.fromJson(json['differenceCoord']);
    DifferenceModel data = DifferenceModel.fromJson(json['data']);

    return DifferenceFoundMessage(
        data: data, differenceCoord: differenceCoord, playerName: playerName);
  }
}
