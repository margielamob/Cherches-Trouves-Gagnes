import 'package:app/domain/utils/vec2.dart';

class DifferenceFoundRequest {
  Vec2 differenceCoord;
  String gameId;
  String playerName;
  bool isOriginal;

  DifferenceFoundRequest(
      {required this.differenceCoord,
      required this.gameId,
      required this.playerName,
      required this.isOriginal});

  Map<String, dynamic> toJson() {
    return {
      'differenceCoord': {'x': differenceCoord.x, 'y': differenceCoord.y},
      'gameId': gameId,
      'playerName': playerName,
      'isOriginal': isOriginal,
    };
  }
}
