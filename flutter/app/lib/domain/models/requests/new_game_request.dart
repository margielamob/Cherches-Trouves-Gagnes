import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/utils/vec2.dart';

class NewGameRequest {
  GameCardModel gameInfo;
  List<Vec2> coords;

  NewGameRequest({required this.gameInfo, required this.coords});

  factory NewGameRequest.fromJson(Map<String, dynamic> json) {
    GameCardModel gameInfo = GameCardModel.fromJson(json['gameCard']);
    List<dynamic> coordsList = json['coords'];
    List<Vec2> parsedCoords = coordsList
        .map((coord) => Vec2.fromJson({'coordinate': coord}))
        .toList();

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
