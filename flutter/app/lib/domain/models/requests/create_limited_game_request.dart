import 'package:app/domain/models/limited_game_model.dart';
import 'package:app/domain/models/user_model.dart';

class CreateLimitedGameRequest {
  UserModel user;
  LimitedGameModel card;

  CreateLimitedGameRequest({required this.user, required this.card});

  Map<String, dynamic> toJson() {
    return {
      'user': {
        'id': user.id,
        'name': user.name,
        'avatar': user.avatar,
      },
      'card': {
        'id': null,
        'timer': card.timer,
        'bonus': card.bonus,
      },
    };
  }
}
