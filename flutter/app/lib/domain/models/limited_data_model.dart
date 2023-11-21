import 'package:app/domain/utils/vec2.dart';

class LimitedDataModel {
  final List<List<Vec2>> coords;
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
    List<List<Vec2>> parsedCoords = coordsList.map<List<Vec2>>((coordList) {
      return List<Vec2>.from(
        coordList
            .map((coord) => Vec2.fromJson({'x': coord['x'], 'y': coord['y']})),
      );
    }).toList();

    return LimitedDataModel(
      coords: parsedCoords,
      nbDifferencesLeft: json['nbDifferencesLeft'],
    );
  }
}
