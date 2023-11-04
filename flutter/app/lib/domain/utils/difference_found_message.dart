import 'package:app/domain/utils/vec2.dart';

class DifferenceFoundMessage {
  List<Vec2> coords;
  int? nbDifferencesLeft;

  DifferenceFoundMessage({required this.coords, this.nbDifferencesLeft});

  factory DifferenceFoundMessage.fromJson(Map<String, dynamic> json) {
    List<dynamic> coordsList = json['coords'] ?? [];
    List<Vec2> parsedCoords =
        coordsList.map((coord) => Vec2.fromJson(coord)).toList();

    return DifferenceFoundMessage(
      coords: parsedCoords,
      nbDifferencesLeft: json['nbDifferencesLeft'],
    );
  }
}
