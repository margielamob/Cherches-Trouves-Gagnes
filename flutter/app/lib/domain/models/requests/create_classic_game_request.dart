import 'package:app/domain/models/classic_game_model.dart';
import 'package:app/domain/models/user_model.dart';

class CreateClassicGameRequest {
  UserModel user;
  ClassicGameModel card;

  CreateClassicGameRequest({required this.user, required this.card});

  Map<String, dynamic> toJson() {
    return {
      'user': {
        'id': user.id,
        'name': user.name,
        'avatar': user.avatar,
      },
      'card': {
        'id': card.id,
        'cheatMode': card.cheatMode,
        'timer': card.timer,
      },
    };
  }
}
