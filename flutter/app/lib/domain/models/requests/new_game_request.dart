import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/utils/vec2.dart';

class NewGameRequest {
  GameCardModel gameInfo;
  List<Vec2> coords;

  NewGameRequest({required this.gameInfo, required this.coords});

  factory NewGameRequest.fromJson(Map<String, dynamic> json) {
    GameCardModel gameInfo = GameCardModel.fromJson(json['gameInfo']);
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

    return NewGameRequest(
      gameInfo: gameInfo,
      coords: parsedCoords,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'gameInfo': {
        'id': gameInfo.id,
        'title': gameInfo.title,
        'thumbnail': gameInfo.thumbnail,
        'nbDifferences': gameInfo.nbDifferences,
        'idEditedBmp': gameInfo.idEditedBmp,
        'idOriginalBmp': gameInfo.idOriginalBmp,
      },
      'coords': coords,
    };
  }
}
