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
    List<Vec2> parsedCoords = coordsList
        .map((coord) => Vec2.fromJson({'coordinate': coord}))
        .toList();

    return LimitedDataModel(
      coords: parsedCoords,
      nbDifferencesLeft: json['nbDifferencesLeft'],
    );
  }
}
