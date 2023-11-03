import 'package:app/domain/models/game_model.dart';

class PlayGameModel {
  final String gameId;
  final GameModel? gameCard;

  PlayGameModel({required this.gameId, this.gameCard});

  factory PlayGameModel.fromJson(Map<String, dynamic> json) {
    return PlayGameModel(
      gameId: json['gameId'],
      gameCard: json['gameCard'] != null
          ? GameModel.fromJson(json['gameCard'])
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
