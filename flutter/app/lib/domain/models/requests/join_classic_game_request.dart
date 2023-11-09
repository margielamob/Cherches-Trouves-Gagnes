import 'package:app/domain/models/user_model.dart';

class JoinClassicGameRequest {
  UserModel user;
  String roomId;
  String socketId;

  JoinClassicGameRequest(
      {required this.user, required this.roomId, required this.socketId});

  Map<String, dynamic> toJson() {
    return {
      'player': {
        'name': user.name,
        'avatar': user.avatar,
        'socketId': socketId,
      },
      'roomId': roomId,
    };
  }
}
