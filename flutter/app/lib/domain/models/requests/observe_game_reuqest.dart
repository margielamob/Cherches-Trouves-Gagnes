import 'package:app/domain/models/user_model.dart';

class ObserveGameRequest {
  UserModel player;
  String roomId;

  ObserveGameRequest({
    required this.player,
    required this.roomId,
  });

  Map<String, dynamic> toJson() {
    return {
      'player': {
        'id': player.id,
        'name': player.name,
        'avatar': player.avatar,
      },
      'roomId': roomId,
    };
  }
}
