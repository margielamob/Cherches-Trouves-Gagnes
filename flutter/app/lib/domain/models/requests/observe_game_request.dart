import 'package:app/domain/models/game_card_model.dart';
import 'package:app/domain/models/limited_data_model.dart';
import 'package:app/domain/models/user_model.dart';

class ObserveGameReceiveRequest {
  String gameId;
  GameCardModel gameCard;
  LimitedDataModel data;
  List<UserModel>? players;

  ObserveGameReceiveRequest(
      {required this.gameId,
      required this.gameCard,
      required this.data,
      this.players});

  factory ObserveGameReceiveRequest.fromJson(Map<String, dynamic> json) {
    GameCardModel gameCard = GameCardModel.fromJson(json['gameCard']);
    LimitedDataModel data = LimitedDataModel.fromJson(json['data']);
    List<UserModel>? players;
    if (json.containsKey('players') && json['players'] != null) {
      players = List<UserModel>.from(
          json['players'].map((playerJson) => UserModel.fromMap(playerJson)));
    }

    return ObserveGameReceiveRequest(
      gameId: json['gameId'],
      gameCard: gameCard,
      data: data,
      players: players,
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
      },
      'players': players,
    };
  }
}
