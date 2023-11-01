import 'package:app/domain/utils/vec2.dart';

class DifferenceFoundRequest {
  Vec2 mousePosition;
  String gameId;

  DifferenceFoundRequest({required this.mousePosition, required this.gameId});

  Map<String, dynamic> toJson() {
    return {
      'mousePosition': {
        "x": mousePosition.x,
        "y": mousePosition.y,
      },
      'gameId': gameId,
    };
  }
}
