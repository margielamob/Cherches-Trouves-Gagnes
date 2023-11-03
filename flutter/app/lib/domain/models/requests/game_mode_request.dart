// Todo: Define use gameMode instead of String

class GameModeRequest {
  String gameMode;

  GameModeRequest({required this.gameMode});

  Map<String, dynamic> toJson() {
    return {
      'mode': gameMode,
    };
  }
}
