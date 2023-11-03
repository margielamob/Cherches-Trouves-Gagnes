import 'package:app/domain/models/game_mode_model.dart';

class WaitingGameModel {
  GameModeModel mode;
  List<String> gamesWaiting;

  WaitingGameModel(this.mode, this.gamesWaiting);

  factory WaitingGameModel.fromJson(Map<String, dynamic> json) {
    List<String> content = (json['gamesWaiting'] as List<dynamic>)
        .map((data) => data.toString())
        .toList();
    return WaitingGameModel(GameModeModel.fromJson(json), content);
  }
}
