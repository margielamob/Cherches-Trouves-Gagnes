// Todo: Define use gameMode instead of String

class GameModeRequestModel {
  String gameMode;

  GameModeRequestModel({required this.gameMode});

  Map<String, dynamic> toJson() {
    return {
      'mode': gameMode,
    };
  }
}
