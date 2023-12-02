import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/observe_game_data_request.dart';

class ObserveGameReceiveRequest {
  String gameId;
  GameCardModel gameCard;
  ObserveGameDataModel data;

  ObserveGameReceiveRequest({
    required this.gameId,
    required this.gameCard,
    required this.data,
  });

  factory ObserveGameReceiveRequest.fromJson(Map<String, dynamic> json) {
    GameCardModel gameCard = GameCardModel.fromJson(json['gameCard']);
    ObserveGameDataModel data = ObserveGameDataModel.fromJson(json['data']);

    return ObserveGameReceiveRequest(
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
        'players': data.players,
      },
    };
  }
}
