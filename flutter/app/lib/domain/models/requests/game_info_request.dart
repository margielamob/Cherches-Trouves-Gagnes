import 'package:app/domain/models/game_card_multi_model.dart';

class GameInfoRequest {
  final String gameId;
  final GameCardMultiModel? gameCard;

  GameInfoRequest({required this.gameId, this.gameCard});

  factory GameInfoRequest.fromJson(Map<String, dynamic> json) {
    return GameInfoRequest(
      gameId: json['gameId'],
      gameCard: json['gameCard'] != null
          ? GameCardMultiModel.fromJson(json['gameCard'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'gameId': gameId,
      'gameCard': gameCard,
    };
  }
}
