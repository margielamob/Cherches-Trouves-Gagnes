import 'package:app/domain/models/game_model_request.dart';

class GameInfoRequest {
  final String gameId;
  final GameModelRequest? gameCard;

  GameInfoRequest({required this.gameId, this.gameCard});

  factory GameInfoRequest.fromJson(Map<String, dynamic> json) {
    return GameInfoRequest(
      gameId: json['gameId'],
      gameCard: json['gameCard'] != null
          ? GameModelRequest.fromJson(json['gameCard'])
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
