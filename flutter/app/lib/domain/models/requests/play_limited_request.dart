import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/limited_data_model.dart';

class PlayLimitedRequest {
  String gameId;
  GameCardModel gameCard;
  LimitedDataModel data;

  PlayLimitedRequest(
      {required this.gameId, required this.gameCard, required this.data});

  factory PlayLimitedRequest.fromJson(Map<String, dynamic> json) {
    GameCardModel gameCard = GameCardModel.fromJson(json['gameCard']);
    LimitedDataModel data = LimitedDataModel.fromJson(json['data']);

    return PlayLimitedRequest(
      gameId: json['gameId'],
      gameCard: gameCard,
      data: data,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'gameId': gameId,
      'gameCard': {
        'id': gameCard.id,
        'title': gameCard.title,
        'thumbnail': gameCard.thumbnail,
        'nbDifferences': gameCard.nbDifferences,
        'idEditedBmp': gameCard.idEditedBmp,
        'idOriginalBmp': gameCard.idOriginalBmp,
      },
      'data': {
        'coords': data.coords,
        'nbDifferencesLeft': data.nbDifferencesLeft,
      }
    };
  }
}
