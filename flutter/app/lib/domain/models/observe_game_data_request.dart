import 'package:app/domain/models/user_model.dart';
import 'package:app/domain/utils/vec2.dart';

class ObserveGameDataModel {
  final List<Vec2> coords;
  final int nbDifferencesLeft;
  final List<UserModel> players;

  const ObserveGameDataModel({
    required this.coords,
    required this.nbDifferencesLeft,
    required this.players,
  });

  ObserveGameDataModel toLimitedDataModel() {
    return ObserveGameDataModel(
      coords: coords,
      nbDifferencesLeft: nbDifferencesLeft,
      players: players,
    );
  }

  factory ObserveGameDataModel.fromJson(Map<String, dynamic> json) {
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
    List<UserModel> players = List<UserModel>.from(
        json['players'].map((playerJson) => UserModel.fromMap(playerJson)));

    return ObserveGameDataModel(
      coords: parsedCoords,
      nbDifferencesLeft: json['nbDifferencesLeft'],
      players: players,
    );
  }
}
