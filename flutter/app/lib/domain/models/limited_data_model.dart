import 'package:app/domain/utils/vec2.dart';

class LimitedDataModel {
  final List<Vec2> coords;
  final int nbDifferencesLeft;

  const LimitedDataModel({
    required this.coords,
    required this.nbDifferencesLeft,
  });

  LimitedDataModel toLimitedDataModel() {
    return LimitedDataModel(
      coords: coords,
      nbDifferencesLeft: nbDifferencesLeft,
    );
  }

  factory LimitedDataModel.fromJson(Map<String, dynamic> json) {
    List<dynamic> coordsList = json['coords'];
    List<Vec2> parsedCoords = coordsList.expand<Vec2>((coordList) {
      return List<Vec2>.from(
        coordList.map((coord) {
          if (coord['x'] != null && coord['y'] != null) {
            return Vec2.fromJson({'x': coord['x'], 'y': coord['y']});
          } else {
            return null;
          }
        }).where((vec2) => vec2 != null),
      );
    }).toList();

    return LimitedDataModel(
      coords: parsedCoords,
      nbDifferencesLeft: json['nbDifferencesLeft'],
    );
  }
}
