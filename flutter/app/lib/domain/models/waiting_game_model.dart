import 'package:app/domain/models/game_mode_model.dart';

class WaitingGameModel {
  GameModeModel mode;
  List<String> gamesWaiting;

  WaitingGameModel(this.mode, this.gamesWaiting);

  factory WaitingGameModel.fromJson(Map<String, dynamic> json) {
    return WaitingGameModel(
      GameModeModel.fromJson(json['mode']),
      List<String>.from(json['gamesWaiting'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'mode': mode.toJson(),
      'gamesWaiting': gamesWaiting,
    };
  }
}
